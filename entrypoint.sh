#!/bin/sh

echo "run_id: $RUN_ID in $ENVIRONMENT"

NOW=$(date +"%Y%m%d-%H%M%S")

if [ -z "${JM_HOME}" ]; then
  JM_HOME=/opt/perftest
fi

JM_SCENARIOS=${JM_HOME}/scenarios
JM_REPORTS=${JM_HOME}/reports
JM_LOGS=${JM_HOME}/logs

mkdir -p ${JM_REPORTS} ${JM_LOGS}

SCENARIOFILE=${JM_SCENARIOS}/${TEST_SCENARIO}.jmx
REPORTFILE=${NOW}-perftest-${TEST_SCENARIO}-report.csv
LOGFILE=${JM_LOGS}/perftest-${TEST_SCENARIO}.log

# Run the test suite
jmeter -n -t ${SCENARIOFILE} -e -l "${REPORTFILE}" -o ${JM_REPORTS} -j ${LOGFILE} -f -Jenv="${ENVIRONMENT}"
test_exit_code=$?

# Publish the results into S3 so they can be displayed in the CDP Portal
# CDP Portal assumes test suite always produce a single html file
if [ -n "$RESULTS_OUTPUT_S3_PATH" ]; then
   if [ -f "$JM_REPORTS/index.html" ]; then
      aws --endpoint-url=$S3_ENDPOINT s3 cp "$JM_REPORTS/index.html" "$RESULTS_OUTPUT_S3_PATH/index.html"
      if [ $? -eq 0 ]; then
        echo "Test results published to $RESULTS_OUTPUT_S3_PATH"
      fi
   else
      echo "$JM_REPORTS is not found"
      exit 1
   fi
else
   echo "RESULTS_OUTPUT_S3_PATH is not set"
   exit 1
fi

exit $test_exit_code
