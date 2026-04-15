class ITSMReopenRateCollector {
}

class ITSMMTTRCollector {
}

class MAFDeclarativeCollector {
}

class ITSMRecurringProblemLinkCollector {
}

class MAFMetricCollectorBase {
    initialize(metricDefGR?: any, assessmentRunGR?: any);
    collect();
}

class MAFCollectorFactory {
    getCollector(className?: any, metricDefGR?: any, runGR?: any);
}

class MAFGroupedAverageCollector {
}

class MAFDrillDownBuilder {
    buildListUrl(table?: any, encodedQuery?: any);
}

class MAFDurationCollector {
}

class MAFChangeScheduleAdherenceCollector {
}

class MAFCollectorTestFixtures {
    getMttrMigrationParamsJson();
    getReopenMigrationParamsJson();
    getCrossTableRatioExampleParamsJson();
    getGroupedAverageExampleParamsJson();
    syntheticDurationStatsHours(hoursArray?: any);
    syntheticRatioPercent(numeratorCount?: any, denominatorCount?: any, emptyDenominatorValue?: any);
    syntheticGroupedAggregate(countsArray?: any, aggregation?: any);
    runInstanceDependencyAudit(assessmentRunSysId?: any);
    syntheticAggregateSubCategories(metricResults?: any, defsByMetricId?: any);
    syntheticSubCategoryScoreFromAgg(agg?: any, greenTh?: any, amberTh?: any);
    syntheticRollSubScoresIntoCategories(subMetaById?: any, subAggs?: any, greenTh?: any, amberTh?: any);
    syntheticCategoryScoreFromAgg(cAgg?: any, greenTh?: any, amberTh?: any);
    runScoringFixtureSanityChecks();
    getSchemaIntrospectionCountParamsJson();
    getSchemaIntrospectionGroupCollisionParamsJson();
    getSchemaIntrospectionRowCountOverThresholdParamsJson();
    getSchemaIntrospectionWindowedCountParamsJson();
    runSyntheticSanityChecks();
}

class MAFSchemaIntrospectionCollector {
}

class MAFOOBChoiceComplianceCollector {
}

class MAFCrossTableRatioCollector {
}

class MAFScoringEngine {
    normalize(raw?: any, metricDefGR?: any);
    scoreRun(runSysId?: any);
}

class MAFPortalMetricsCollector {
}

class MAFAssessmentRunner {
    run(runSysId?: any);
    backgroundProcess(runSysId?: any);
    runSync(runSysId?: any);
}

class MAFAISummaryProvider {
    generate(runSysId?: any);
    buildPromptEnvelope(payload?: any);
}

class MAFWindowedRatioCollector {
}

