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

#############################################################################################
# Define the HTML file
HTML_FILE="$JM_REPORTS/index.html"

# Extract the Start Time, End Time, and File values using awk
START_TIME=$(awk -F'Start Time: |</td>' '/Start Time:/ {print $2}' "$HTML_FILE")
END_TIME=$(awk -F'End Time: |</td>' '/End Time:/ {print $2}' "$HTML_FILE")
FILE=$(awk -F'File: |</td>' '/File:/ {print $2}' "$HTML_FILE")

# Print the extracted values
if [ -n "$START_TIME" ]; then
    echo "Start Time: $START_TIME"
    echo "End Time: $END_TIME"
    echo "File: $FILE"
else
    echo "Values not found in $HTML_FILE."
fi

# Define the source and destination paths
SOURCE_PATH="/opt/perftest/index.html"
DESTINATION_PATH="$JM_REPORTS/index.html"

# Copy the index.html file from the source to the destination
cp "$SOURCE_PATH" "$DESTINATION_PATH"

# Check if the copy was successful
if [ $? -eq 0 ]; then
    echo "File copied successfully."
else
    echo "Failed to copy the file."
    exit 1
fi

# Use awk to update the START_TIME, END_TIME, and File values in the destination file
awk -v start_time="$START_TIME" -v end_time="$END_TIME" -v new_file="$FILE" '
    /Start Time:/ { sub(/Start Time: .*/, "Start Time: " start_time "</td>") }
    /End Time:/ { sub(/End Time: .*/, "End Time: " end_time "</td>") }
    /File:/ { sub(/File: .*/, "File: " new_file "</td>") }
    { print }
' "$DESTINATION_PATH" > "${DESTINATION_PATH}.tmp" && mv "${DESTINATION_PATH}.tmp" "$DESTINATION_PATH"

# Check if the updates were successful
if [ $? -eq 0 ]; then
    echo "Values updated successfully."
else
    echo "Failed to update values."
    exit 1
fi

# Define the source and destination paths for OverTime.html
SOURCE_PATH="/opt/perftest/OverTime.html"
DESTINATION_PATH="$JM_REPORTS/content/pages/OverTime.html"

# Copy the OverTime.html file from the source to the destination
cp "$SOURCE_PATH" "$DESTINATION_PATH"

# Check if the copy was successful
if [ $? -eq 0 ]; then
    echo "File copied successfully."
else
    echo "Failed to copy the file."
    exit 1
fi
##########################################################################################


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
