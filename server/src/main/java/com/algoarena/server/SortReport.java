package com.algoarena.server;

/**
 * This is a "POJO" (Plain Old Java Object).
 * Its only job is to hold the data for one algorithm's performance.
 * Spring will automatically turn this object into JSON for our frontend.
 */
public class SortReport {

    private String algorithmName;
    private int arraySize;
    private double executionTimeMillis;
    private long comparisons;
    private long swaps;

    // A constructor to make it easy to create a new report
    public SortReport(String algorithmName, int arraySize, double executionTimeMillis, long comparisons, long swaps) {
        this.algorithmName = algorithmName;
        this.arraySize = arraySize;
        this.executionTimeMillis = executionTimeMillis;
        this.comparisons = comparisons;
        this.swaps = swaps;
    }

    // --- Getters ---
    // These are public methods that let other classes (like Spring)
    // read the private fields. This is a core Java concept.

    public String getAlgorithmName() {
        return algorithmName;
    }

    public int getArraySize() {
        return arraySize;
    }

    public double getExecutionTimeMillis() {
        return executionTimeMillis;
    }

    public long getComparisons() {
        return comparisons;
    }

    public long getSwaps() {
        return swaps;
    }
}