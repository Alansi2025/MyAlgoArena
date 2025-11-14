package com.algoarena.server;

import org.springframework.stereotype.Service;

@Service
public class SelectionSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "Selection Sort";
    }

    @Override
    public SortReport sort(int[] array) {
        int[] arr = array.clone();
        int n = arr.length;

        long comparisons = 0;
        long swaps = 0;
        long startTime = System.nanoTime();

        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                comparisons++;
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                }
            }

            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
            swaps++;
        }

        long endTime = System.nanoTime();
        double durationMillis = (endTime - startTime) / 1_000_000.0;

        return new SortReport(this.getName(), n, durationMillis, comparisons, swaps);
    }
}