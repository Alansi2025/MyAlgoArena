package com.algoarena.server;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BucketSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "Bucket Sort";
    }

    private static class Counters {
        long comparisons = 0;
        long swaps = 0; // Data moves
    }

    // Helper to sort individual buckets (we'll use insertion sort)
    private void insertionSortForBucket(List<Integer> bucket, Counters counters) {
        for (int i = 1; i < bucket.size(); ++i) {
            int key = bucket.get(i);
            int j = i - 1;

            counters.comparisons++; // Initial check
            while (j >= 0 && bucket.get(j) > key) {
                if (j > 0) counters.comparisons++; // Checks inside the loop

                bucket.set(j + 1, bucket.get(j));
                counters.swaps++; // Data shift
                j = j - 1;
            }
            bucket.set(j + 1, key);
            counters.swaps++; // Final placement
        }
    }

    @Override
    public SortReport sort(int[] array) {
        // Bucket sort also works best on non-negative data
        int maxVal = 0;
        for (int val : array) {
            if (val < 0) return new SortReport(this.getName(), -1, 0, 0); // Fail
            if (val > maxVal) maxVal = val;
        }

        int[] arr = array.clone();
        int n = arr.length;
        if (n <= 0) {
            return new SortReport(this.getName(), 0, 0, 0);
        }

        Counters counters = new Counters();
        long startTime = System.nanoTime();

        // 1. Create empty buckets
        @SuppressWarnings("unchecked")
        List<Integer>[] buckets = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            buckets[i] = new ArrayList<>();
        }

        // 2. Put array elements in different buckets
        for (int i = 0; i < n; i++) {
            // Formula to distribute elements. (long) cast to prevent overflow.
            int bucketIndex = (int) ((long)arr[i] * n / (maxVal + 1));
            buckets[bucketIndex].add(arr[i]);
            counters.swaps++; // Count as a "data move"
        }

        // 3. Sort individual buckets
        for (int i = 0; i < n; i++) {
            // We use our own insertion sort to track metrics
            insertionSortForBucket(buckets[i], counters);
        }

        // 4. Concatenate all buckets back into arr[]
        int index = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < buckets[i].size(); j++) {
                arr[index++] = buckets[i].get(j);
                counters.swaps++; // Count as a "data move"
            }
        }

        long endTime = System.nanoTime();
        long durationNanos = endTime - startTime;

        return new SortReport(this.getName(), durationNanos, counters.comparisons, counters.swaps);
    }
}