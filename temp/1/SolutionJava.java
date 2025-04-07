import java.io.*;
import java.util.*;

public class Main {

   public static List<Integer> twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();  // value -> index

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return Arrays.asList(map.get(complement), i);  // ✅ return solution
        }
        map.put(nums[i], i);
    }

    return new ArrayList<>();
}


    public static int[] parseStringToArray(String input) {
        input = input.replace("[", "").replace("]", "");
        String[] parts = input.split(",");
        int[] result = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            if (!parts[i].trim().isEmpty()) {
                result[i] = Integer.parseInt(parts[i].trim());
            }
        }
        return result;
    }

    public static void main(String[] args) throws IOException {
        // Fast IO
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int t = 1;
        while (t-- > 0) {
            String s = br.readLine(); // Input like: [2,7,11,15]
            int[] ar = parseStringToArray(s);

            int target = Integer.parseInt(br.readLine());

            List<Integer> res = twoSum(ar, target);

            if (res.size() != 2 || Objects.equals(res.get(0), res.get(1)) || 
                res.get(0) >= ar.length || res.get(1) >= ar.length || 
                ar[res.get(0)] + ar[res.get(1)] != target) {
                System.out.println("Test Case Failed :");
                System.out.print("[");
                for (int i = 0; i < ar.length; i++) {
                    System.out.print(ar[i]);
                    if (i != ar.length - 1) System.out.print(",");
                }
                System.out.println("]");
            } else {
                System.out.println("Test Case Passed ✅");
            }
        }
    }
}
