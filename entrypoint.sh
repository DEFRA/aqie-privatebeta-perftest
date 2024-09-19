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

########################################Avik############################################
# Check if the file exists and print its content
#if [ -f "$JM_REPORTS/index.html" ]; then
    # Read and print the content of the CSV report
#    cat "$JM_REPORTS/index.html"
#else
#   echo "Report file not found at $LOGFILE"
#fi



# Define the HTML file and the value to search for
#HTML_FILE="$JM_REPORTS/index.html"
#SEARCH_VALUE="graph.js"
#SEARCH_VALUE1="</html>"

# Check if the file contains the search value
#if grep -q "$SEARCH_VALUE" "$HTML_FILE"; then
#    echo "Value '$SEARCH_VALUE' found in $HTML_FILE."
#else
#    echo "No value '$SEARCH_VALUE' present in $HTML_FILE."
#fi

# Check if the file contains the search value
#if grep -q "$SEARCH_VALUE1" "$HTML_FILE"; then
#    echo "Value '$SEARCH_VALUE1' found in $HTML_FILE."
#else
#    echo "No value '$SEARCH_VALUE1' present in $HTML_FILE."
#fi



# Define the HTML file and the content to append
HTML_FILE="$JM_REPORTS/index.html"
CONTENT='
    <!-- jQuery -->
    <script src="sbadmin2-1.0.7/bower_components/jquery/dist/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="sbadmin2-1.0.7/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot/excanvas.min.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot/jquery.flot.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot/jquery.flot.pie.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot/jquery.flot.resize.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot/jquery.flot.time.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js"></script>
    <script src="sbadmin2-1.0.7/bower_components/flot-axislabels/jquery.flot.axislabels.js"></script>
    <!-- Metis Menu Plugin JavaScript -->
    <script src="sbadmin2-1.0.7/bower_components/metisMenu/dist/metisMenu.min.js"></script>

    <script src="content/js/dashboard-commons.js"></script>
    <script src="content/js/dashboard.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="sbadmin2-1.0.7/dist/js/sb-admin-2.js"></script>
    <script type="text/javascript" src="content/js/jquery.tablesorter.min.js"></script>
'

# Use sed to insert the content before the </body> tag
sed -i "/<\/body>/i $CONTENT" "$HTML_FILE"

# Check if the append was successful
if [ $? -eq 0 ]; then
    echo "Content appended successfully before in Index HTML</body>."
else
    echo "Failed to append content Index HTML."
fi




# Define the HTML file and the content to append
HTML_FILE="$JM_REPORTS/content/pages/OverTime.html"
CONTENT='
    <!-- /#wrapper -->

    <!-- jQuery -->
    <script src="../../sbadmin2-1.0.7/bower_components/jquery/dist/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="../../sbadmin2-1.0.7/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="../../sbadmin2-1.0.7/bower_components/metisMenu/dist/metisMenu.min.js"></script>

    <!-- Flot Charts JavaScript -->
    <script src="../../sbadmin2-1.0.7/bower_components/flot/excanvas.min.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot/jquery.flot.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot/jquery.flot.pie.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot/jquery.flot.resize.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot/jquery.flot.canvas.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot/jquery.flot.time.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot/jquery.flot.selection.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js"></script>
    <script src="../../sbadmin2-1.0.7/bower_components/flot-axislabels/jquery.flot.axislabels.js"></script>
    <script src="../js/jquery.flot.stack.js"></script>
    <script src="../js/hashtable.js"></script>
    <script src="../js/jquery.numberformatter-1.2.3.min.js"></script>
    <script src="../js/curvedLines.js"></script>
    <script src="../js/dashboard-commons.js"></script>
    <script src="../js/graph.js"></script>
    <script src="../js/jquery-ui.min.js"></script>
    <script src="../js/jquery.cookie.js"></script>
    <!-- Custom Theme JavaScript -->
    <script src="../../sbadmin2-1.0.7/dist/js/sb-admin-2.js"></script>
'

# Use sed to insert the content before the </body> tag
sed -i "/<\/body>/i $CONTENT" "$HTML_FILE"

# Check if the append was successful
if [ $? -eq 0 ]; then
    echo "Content appended successfully before </body> in OverTime."
else
    echo "Failed to append content OverTime."
fi



###########################################################################################

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
