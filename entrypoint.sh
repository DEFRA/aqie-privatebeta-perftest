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

SCENARIOFILE=${JM_SCENARIOS}/AQIE_DisplayAirQualityResult_DebugV2.jmx
REPORTFILE=${NOW}-perftest-${TEST_SCENARIO}-report.csv
LOGFILE=${JM_LOGS}/perftest-${TEST_SCENARIO}.log

# Run the test suite
jmeter -n -t ${SCENARIOFILE} -e -l "${REPORTFILE}" -o ${JM_REPORTS} -j ${LOGFILE} -f -Jenv="${ENVIRONMENT}"
test_exit_code=$?

#!/bin/bash

# Define the HTML file and the start and end strings
HTML_FILE="$JM_REPORTS/content/pages/OverTime.html"
START_STRING="<td>Start Time:</td>"
END_STRING="</tr>"

# Use awk to find and print the values between the start and end strings
awk -v start="$START_STRING" -v end="$END_STRING" '
    BEGIN { found=0 }
    {
        if (index($0, start)) { found=1; sub(".*"start, ""); }
        if (found) { print; }
        if (index($0, end)) { found=0; sub(end".*", ""); }
    }
' "$HTML_FILE"

# Define the HTML file and the start and end strings
HTML_FILE="$JM_REPORTS/content/pages/OverTime.html"
START_STRING="<td>End Time:</td>"
END_STRING="</tr>"

# Use awk to find and print the values between the start and end strings
awk -v start="$START_STRING" -v end="$END_STRING" '
    BEGIN { found=0 }
    {
        if (index($0, start)) { found=1; sub(".*"start, ""); }
        if (found) { print; }
        if (index($0, end)) { found=0; sub(end".*", ""); }
    }
' "$HTML_FILE"

# Define the HTML file and the start and end strings
HTML_FILE="$JM_REPORTS/content/pages/OverTime.html"
START_STRING="<td>File:</td>"
END_STRING="</tr>"

# Use awk to find and print the values between the start and end strings
awk -v start="$START_STRING" -v end="$END_STRING" '
    BEGIN { found=0 }
    {
        if (index($0, start)) { found=1; sub(".*"start, ""); }
        if (found) { print; }
        if (index($0, end)) { found=0; sub(end".*", ""); }
    }
' "$HTML_FILE"


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
