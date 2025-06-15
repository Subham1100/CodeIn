import Profile from "/images/profile.jpeg";
const Team = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#3d938775] p-10">
      <p className="text-5xl mb-10">Our Team</p>
      <div className="flex flex-col  rounded-2xl  justify-center items-center gap-5 bg-[#b5d6d3c7]">
        <div className="p-4">
          <div className="w-50 h-50 overflow-hidden rounded-full">
            <img src={Profile} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className=" bg-[#032719] w-full flex flex-col justify-center items-center p-4 gap-1">
          <p className="font-bold text-gray-200 ">Subham Chauhan</p>
          <p className="font-extralight text-gray-200 ">Developer</p>
          <p className=" text-gray-200 "></p>
        </div>
      </div>
    </div>
  );
};

export default Team;
