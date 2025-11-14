package com.algoarena.server;

import org.springframework.stereotype.Service;
import java.util.Arrays;

@Service
public class RadixSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "Radix Sort";
    }

    // A private class to hold our counters during recursion
    private static class Counters {
        long swaps = 0;
        // Note: Radix sort is not a comparison-based sort.
        // We will track "swaps" as data writes/moves.
    }

    // Utility function to get maximum value in arr[]
    private int getMax(int[] arr, int n) {
        int mx = arr[0];
        for (int i = 1; i < n; i++)
            if (arr[i] > mx)
                mx = arr[i];
        return mx;
    }

    // A function to do counting sort of arr[] according to
    // the digit represented by exp.
    private void countingSort(int[] arr, int n, int exp, Counters counters) {
        int[] output = new int[n]; // output array
        int[] count = new int[10];
        Arrays.fill(count, 0);

        // Store count of occurrences in count[]
        for (int i = 0; i < n; i++) {
            count[(arr[i] / exp) % 10]++;
        }

        // Change count[i] so that count[i] now contains
        // actual position of this digit in output[]
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build the output array
        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
            counters.swaps++; // Count this as a data move
        }

        // Copy the output array to arr[], so that arr[] now
        // contains sorted numbers according to current digit
        for (int i = 0; i < n; i++) {
            arr[i] = output[i];
            counters.swaps++; // Count this as a data move
        }
    }

    @Override
    public SortReport sort(int[] array) {
        // Radix sort must operate on non-negative numbers
        // We will skip sorting if we find a negative number
        for (int x : array) {
            if (x < 0) {
                return new SortReport(this.getName(), -1, 0, 0); // -1 indicates failure
            }
        }

        int[] arr = array.clone();
        int n = arr.length;
        Counters counters = new Counters();

        long startTime = System.nanoTime();

        // Find the maximum number to know number of digits
        int m = getMax(arr, n);

        // Do counting sort for every digit. Note that
        // instead of passing digit number, exp is passed.
        // exp is 10^i where i is current digit number
        for (int exp = 1; m / exp > 0; exp *= 10) {
            countingSort(arr, n, exp, counters);
        }

        long endTime = System.nanoTime();
        long durationNanos = endTime - startTime;

        return new SortReport(this.getName(), durationNanos, 0, counters.swaps);
    }
}