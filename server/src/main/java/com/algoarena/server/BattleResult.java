package com.algoarena.server;

import java.util.List;

public class BattleResult {

    private final String arrayType;
    private final int arraySize;
    private final List<SortReport> reports;

    public BattleResult(String arrayType, int arraySize, List<SortReport> reports) {
        this.arrayType = arrayType;
        this.arraySize = arraySize;
        this.reports = reports;
    }

    public String getArrayType() {
        return arrayType;
    }

    public int getArraySize() {
        return arraySize;
    }

    public List<SortReport> getReports() {
        return reports;
    }
}