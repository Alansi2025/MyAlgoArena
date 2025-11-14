package com.algoarena.server;

import org.springframework.stereotype.Service;

@Service
public class QuickSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "QuickSort";
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

        quickSortRecursive(arr, 0, n - 1, counters);

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

    private void quickSortRecursive(int[] arr, int low, int high, Counters counters) {
        if (low < high) {
            int pi = partition(arr, low, high, counters);
            quickSortRecursive(arr, low, pi - 1, counters);
            quickSortRecursive(arr, pi + 1, high, counters);
        }
    }

    private int partition(int[] arr, int low, int high, Counters counters) {
        int pivot = arr[high];
        int i = (low - 1);

        for (int j = low; j < high; j++) {
            counters.comparisons++;
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j, counters);
            }
        }

        swap(arr, i + 1, high, counters);
        return i + 1;
    }

    private void swap(int[] arr, int i, int j, Counters counters) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        counters.swaps++;
    }
}