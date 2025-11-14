package com.algoarena.server;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class BogoSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "BogoSort (The Chaotic)";
    }

    private static class Counters {
        long comparisons = 0;
        long swaps = 0; // Here "swaps" will be "shuffles"
    }

    // Helper to check if array is sorted
    private boolean isSorted(int[] arr, Counters counters) {
        for (int i = 0; i < arr.length - 1; i++) {
            counters.comparisons++;
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    // Helper to shuffle the array (Fisher-Yates shuffle)
    private void shuffle(int[] arr, Random rand, Counters counters) {
        counters.swaps++; // Count one full "shuffle" as one "swap"
        for (int i = arr.length - 1; i > 0; i--) {
            int j = rand.nextInt(i + 1);
            // Simple swap
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    @Override
    public SortReport sort(int[] array) {
        // --- !!! SAFETY GUARD !!! ---
        // BogoSort is O((n+1)!), which is unusable for n > 10.
        // We will "give up" if the array is too large.
        if (array.length > 10) {
            // -1 duration indicates failure/timeout
            return new SortReport(this.getName(), -1, 0, 0);
        }

        int[] arr = array.clone();
        Counters counters = new Counters();
        Random rand = new Random();

        long startTime = System.nanoTime();

        // Keep shuffling until it's sorted
        while (!isSorted(arr, counters)) {
            shuffle(arr, rand, counters);
        }

        long endTime = System.nanoTime();
        long durationNanos = endTime - startTime;

        return new SortReport(this.getName(), durationNanos, counters.comparisons, counters.swaps);
    }
}