package com.algoarena.server;

import org.springframework.stereotype.Service;

@Service
public class InsertionSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "Insertion Sort";
    }

    @Override
    public SortReport sort(int[] array) {
        int[] arr = array.clone();
        int n = arr.length;

        long comparisons = 0;
        long swaps = 0;
        long startTime = System.nanoTime();

        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;

            comparisons++;
            while (j >= 0 && arr[j] > key) {
                if (j > 0) comparisons++;
                arr[j + 1] = arr[j];
                swaps++;
                j = j - 1;
            }
            arr[j + 1] = key;
        }

        long endTime = System.nanoTime();
        double durationMillis = (endTime - startTime) / 1_000_000.0;

        return new SortReport(this.getName(), n, durationMillis, comparisons, swaps);
    }
}