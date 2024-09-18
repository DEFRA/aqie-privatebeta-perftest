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

SCENARIOFILE=${JM_SCENARIOS}/AQIE_DisplayAirQualityResult_Debug.jmx
REPORTFILE=${NOW}-perftest-${TEST_SCENARIO}-report.csv
LOGFILE=${JM_LOGS}/perftest-${TEST_SCENARIO}.log

# Run the test suite
jmeter -n -t ${SCENARIOFILE} -e -l "${REPORTFILE}" -j ${LOGFILE} -f -Jenv="${ENVIRONMENT}"



###############Update the CSV file######################
# Path to the original CSV file
ORIGINAL_CSV="$REPORTFILE"
# Path to the updated CSV file
UPDATED_CSV="$REPORTFILE"

# Function to convert mm:ss.0 to yyyy/MM/dd HH:mm:ss
convert_to_human_readable() {
    local timestamp=$1
    local minutes=${timestamp%:*}
    local seconds=${timestamp#*:}
    local total_seconds=$((minutes * 60 + seconds))
    date -d "@$total_seconds" +"%Y/%m/%d %H:%M:%S"
}

# Read the original CSV file and update the timestamp format
awk -F, 'BEGIN {OFS=","} 
{
    if (NR == 1) {
        print $0  # Print header as is
    } else {
        cmd = "date -d \"1970-01-01 " $1 "\" +\"%Y/%m/%d %H:%M:%S\""
        cmd | getline $1
        close(cmd)
        print $0
    }
}' "$ORIGINAL_CSV" > "$UPDATED_CSV"

echo "Timestamp format updated and saved to $UPDATED_CSV"



# Generate the HTML report
jmeter -g ${REPORTFILE} -o ${JM_REPORTS}
test_exit_code=$?

#### Path to the HTML report file###Avik
#REPORT_PATH="${JM_REPORTS}/content/pages/OverTime.html"

# Check if the file exists
#if [ -f "$REPORT_PATH" ]; then
    # Read and print the content of the HTML report
#    cat "$REPORT_PATH"
#else
#    echo "Report file not found at $REPORT_PATH"
#fi

# Check if the file exists and print its content
#if [ -f "$REPORTFILE" ]; then
    # Read and print the content of the CSV report
#    cat "$REPORTFILE"
#else
#    echo "Report file not found at $REPORTFILE"
#fi

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
