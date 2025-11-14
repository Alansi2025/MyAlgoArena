package com.algoarena.server;

import org.springframework.stereotype.Service;

@Service
public class MergeSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "Merge Sort";
    }

    private static class Counters {
        long comparisons = 0;
        long swaps = 0;
    }

    @Override
    public SortReport sort(int[] array) {
        int[] arr = array.clone();
        int n = arr.length;
        Counters counters = new Counters();
        long startTime = System.nanoTime();

        mergeSortRecursive(arr, 0, n - 1, counters);

        long endTime = System.nanoTime();
        double durationMillis = (endTime - startTime) / 1_000_000.0;

        return new SortReport(
                this.getName(),
                n,
                durationMillis,
                counters.comparisons,
                counters.swaps
        );
    }

    private void mergeSortRecursive(int[] arr, int l, int r, Counters counters) {
        if (l < r) {
            int m = (l + r) / 2;
            mergeSortRecursive(arr, l, m, counters);
            mergeSortRecursive(arr, m + 1, r, counters);
            merge(arr, l, m, r, counters);
        }
    }

    void merge(int[] arr, int l, int m, int r, Counters counters) {
        int n1 = m - l + 1;
        int n2 = r - m;

        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; ++i) {
            L[i] = arr[l + i];
        }
        for (int j = 0; j < n2; ++j) {
            R[j] = arr[m + 1 + j];
        }

        int i = 0, j = 0;
        int k = l;
        while (i < n1 && j < n2) {
            counters.comparisons++;
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
                counters.swaps++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
}