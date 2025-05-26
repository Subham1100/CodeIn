import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/socketContext";
import { Editor, Tldraw, TLEventMapHandler, TLRecord } from "tldraw";
import axios from "axios";

import "tldraw/tldraw.css";

type ChangeSet = {
  added: TLRecord[];
  updated: [from: TLRecord, to: TLRecord][];
  removed: TLRecord[];
};

export default function StoreEventsExample() {
  const mouseDownRef = useRef(false);
  const typingRef = useRef(false);
  const roomRef = useRef(true);

  const [collectedUpdates, setCollectedUpdates] = useState<
    [TLRecord, TLRecord][]
  >([]);
  const [collectedAdds, setCollectedAdds] = useState<TLRecord[]>([]);
  const [collectedRemovals, setCollectedRemovals] = useState<TLRecord[]>([]);
  const isApplyingRemoteChange = useRef(false);
  const { roomId } = useParams();
  const socket = useSocket();
  const [editor, setEditor] = useState<Editor | null>(null);

  const setAppToState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  // Handle incoming socket updates (remote changes)
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = (changes: ChangeSet) => {
      isApplyingRemoteChange.current = true;

      // Add new records
      editor.store.put(changes.added);
      editor.store.put(changes.updated.map(([_, to]) => to));
      editor.store.remove(changes.removed.map((record) => record.id));

      isApplyingRemoteChange.current = false;
    };

    socket.on("whiteboardUpdated", handleUpdate);

    return () => {
      socket.off("whiteboardUpdated", handleUpdate);
    };
  }, [editor, socket]);
  useEffect(() => {
    if (!editor || !roomRef.current) return;
    const getInitialData = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/database/api/room/tlDrawElements`,
          {
            headers: authenticationHeader,
            params: {
              roomId: roomId,
            },
          }
        );
        if (!editor) {
          // Optional: wait or skip if editor is not ready yet
          console.warn("Editor not ready on first render");
          return;
        }

        const handleUpdate = (changes: ChangeSet) => {
          isApplyingRemoteChange.current = true;

          editor.store.put(changes.added);
          editor.store.put(changes.updated.map(([_, to]) => to));
          editor.store.remove(changes.removed.map((record) => record.id));

          isApplyingRemoteChange.current = false;
        };

        handleUpdate(response.data.tlDrawElements);
        roomRef.current = false;
      } catch (error) {
        console.error("Failed to get tlDrawElements:", error);
      }
    };

    // Only call if editor is ready on mount
    getInitialData();
  }, [editor, roomId]); // Empty dependency array = only runs on first mount (refresh/login)

  // Listen to editor changes made locally by user and emit them
  useEffect(() => {
    if (!editor) return;
    const handleChangeEvent: TLEventMapHandler<"change"> = async (change) => {
      if (isApplyingRemoteChange.current) return; // Ignore remote-applied changes

      // Filter only TLRecords where typeName === "shape"
      const added = Object.values(change.changes.added).filter(
        (record) => record.typeName === "shape"
      );

      const updatedPairs = Object.values(change.changes.updated).filter(
        ([from, to]) => from.typeName === "shape" && to.typeName === "shape"
      );

      const removed = Object.values(change.changes.removed).filter(
        (record) => record.typeName === "shape"
      );

      if (typingRef.current) {
        setCollectedUpdates((prev) => [...prev, ...updatedPairs]);
      } else {
      }
      if (mouseDownRef.current) {
        socket.emit("whiteboardChanged", {
          changes: {
            added: added,
            updated: updatedPairs,
            removed: removed,
          },
          roomId,
        });
        const changes = {
          added: added,
          updated: updatedPairs,
          removed: removed,
        };
        const token = localStorage.getItem("token");
        const authenticationHeader = {
          Authorization: token,
        };
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/database/api/room/tlDrawElements`,
            {
              roomId: roomId,
              tlDrawElements: changes,
            },
            {
              headers: authenticationHeader,
            }
          );
        } catch (error) {
          console.error("Failed to save tlDrawElements:", error);
        }
      }
    };

    // Listen only to user-originated changes
    const cleanupFunction = editor.store.listen(handleChangeEvent, {
      source: "user",
      scope: "all",
    });

    return () => {
      cleanupFunction();
    };
  }, [editor, roomId, socket]);

  const handleMouseDown = () => {
    mouseDownRef.current = true;
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
  };

  function useIsTyping() {
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          typingRef.current = true;
          setIsTyping(true);
        }
      };

      const handleFocusOut = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          typingRef.current = false;
          setIsTyping(false);
        }
      };

      window.addEventListener("focusin", handleFocusIn);
      window.addEventListener("focusout", handleFocusOut);

      return () => {
        window.removeEventListener("focusin", handleFocusIn);
        window.removeEventListener("focusout", handleFocusOut);
      };
    }, []);

    return isTyping;
  }

  const isTyping = useIsTyping();

  useEffect(() => {
    if (!isTyping && collectedUpdates.length) {
      const saveChanges = async () => {
        socket.emit("whiteboardChanged", {
          changes: {
            added: collectedAdds,
            updated: collectedUpdates,
            removed: collectedRemovals,
          },
          roomId,
        });

        const changes = {
          added: collectedAdds,
          updated: collectedUpdates,
          removed: collectedRemovals,
        };

        const token = localStorage.getItem("token");
        const authenticationHeader = {
          Authorization: token,
        };

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/database/api/room/tlDrawElements`,
            {
              roomId: roomId,
              tlDrawElements: changes,
            },
            {
              headers: authenticationHeader,
            }
          );
        } catch (error) {
          console.error("Failed to save tlDrawElements:", error);
        }
      };

      // Call the async function
      saveChanges();
    }
  }, [isTyping]);

  return (
    <div
      className="h-[700px]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Tldraw onMount={setAppToState} />
    </div>
  );
}
