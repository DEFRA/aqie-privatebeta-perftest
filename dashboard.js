/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = true;
var seriesFilter = "^(AQIE_ESW_LocationListSearch_T01_LaunchURL|AQIE_ESW_LocationListSearch_T02_EnterPassword|AQIE_ESW_LocationListSearch_T03_ClickStartNow|AQIE_ESW_LocationListSearch_T04_EnterLoc_ESW&Continue|AQIE_ESW_LocationListSearch_T05_SelectLocationFromList|AQIE_ESW_LocationListSearch_T06_SelectLinkUnderGases|AQIE_ESW_LocationListSearch_T07_ClickBackLinkInBrowser|AQIE_ESW_LocationListSearch_T08_SelectLinkUnderPM|AQIE_ESW_LocationListSearch_T09_ClickBackLinkInBrowser|AQIE_ESW_LocationListSearch_T10_ClickChangeLocationLink|AQIE_ESW_LocationListSearch_T11_CloseBrowser|AQIE_ESW_LocationSearch_T01_LaunchURL|AQIE_ESW_LocationSearch_T02_EnterPassword|AQIE_ESW_LocationSearch_T03_ClickStartNow|AQIE_ESW_LocationSearch_T04_CheckEnglandScotWales|AQIE_ESW_LocationSearch_T04_EnterLoc_ESW&Continue|AQIE_ESW_LocationSearch_T05_SelectLinkUnderGases|AQIE_ESW_LocationSearch_T06_ClickBackLinkInBrowser|AQIE_ESW_LocationSearch_T07_SelectLinkUnderPM|AQIE_ESW_LocationSearch_T08_ClickBackLinkInBrowser|AQIE_ESW_LocationSearch_T09_ClickChangeLocationLink|AQIE_ESW_LocationSearch_T10_CloseBrowser|AQIE_ESW_PostcodeListSearch_T01_LaunchURL|AQIE_ESW_PostcodeListSearch_T02_EnterPassword|AQIE_ESW_PostcodeListSearch_T03_ClickStartNow|AQIE_ESW_PostcodeListSearch_T04_EnterPostcode&Continue|AQIE_ESW_PostcodeListSearch_T06_SelectPostcode|AQIE_ESW_PostcodeListSearch_T07_SelectLinkUnderGases|AQIE_ESW_PostcodeListSearch_T08_ClickBackLinkInBrowser|AQIE_ESW_PostcodeListSearch_T09_SelectLinkUnderPM|AQIE_ESW_PostcodeListSearch_T10_ClickBackLinkInBrowser|AQIE_ESW_PostcodeListSearch_T11_ClickChangeLocationLink|AQIE_ESW_PostcodeListSearch_T12_CloseBrowser|AQIE_ESW_PostcodeSearch_T01_LaunchURL|AQIE_ESW_PostcodeSearch_T02_EnterPassword|AQIE_ESW_PostcodeSearch_T03_ClickStartNow|AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue|AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases|AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser|AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM|AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser|AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink|AQIE_ESW_PostcodeSearch_T11_CloseBrowser|AQIE_NI_PostcodeSearch_T01_LaunchURL|AQIE_NI_PostcodeSearch_T02_EnterPassword|AQIE_NI_PostcodeSearch_T03_ClickStartNow|AQIE_NI_PostcodeSearch_T04_EnterPostcode&Continue|AQIE_NI_PostcodeSearch_T06_SelectLinkUnderGases|AQIE_NI_PostcodeSearch_T07_ClickBackLinkInBrowser|AQIE_NI_PostcodeSearch_T08_SelectLinkUnderPM|AQIE_NI_PostcodeSearch_T09_ClickBackLinkInBrowser|AQIE_NI_PostcodeSearch_T10_ClickChangeLocationLink|AQIE_NI_PostcodeSearch_T11_CloseBrowser)(-success|-failure)?$";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.79919678714859, "KoPercent": 0.20080321285140562};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9955686853766618, 5000, 7000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue-0-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser-00-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser-00"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink-0-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL-00"], "isController": false}, {"data": [0.95, 5000, 7000, "AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases-0"], "isController": false}, {"data": [0.95, 5000, 7000, "AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T03_ClickStartNow-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases-0-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T02_EnterPassword-01-1"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T02_EnterPassword-02-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T02_EnterPassword-01-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T02_EnterPassword"], "isController": true}, {"data": [0.95, 5000, 7000, "AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser-0-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM-0-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-2"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-1"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-4"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-3"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T03_ClickStartNow"], "isController": true}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T03_ClickStartNow-0-0"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T02_EnterPassword-02"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T02_EnterPassword-01"], "isController": false}, {"data": [1.0, 5000, 7000, "AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 498, 1, 0.20080321285140562, 480.87148594377516, 22, 10557, 81.5, 1663.0, 1815.8999999999983, 3016.7099999999973, 5.282474489254726, 51.12690137259477, 7.3660992492627875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue-0-0", 20, 0, 0.0, 1645.6, 1117, 3014, 1594.5, 2895.8000000000025, 3013.75, 3014.0, 0.22987448852926304, 1.608661221754172, 0.3570687123580525], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM", 20, 0, 0.0, 110.70000000000002, 67, 546, 83.0, 146.40000000000003, 526.0999999999997, 546.0, 0.23559623517216197, 1.3270234035410113, 0.32371474891331237], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser-00-0", 20, 0, 0.0, 1585.2499999999998, 1232, 2056, 1659.5, 1959.4000000000003, 2051.7, 2056.0, 0.23120050864111902, 4.761217740304029, 0.19498511646725625], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser-00", 20, 0, 0.0, 1585.2499999999998, 1232, 2056, 1659.5, 1959.4000000000003, 2051.7, 2056.0, 0.23120050864111902, 4.761217740304029, 0.19498511646725625], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink-0-0", 19, 0, 0.0, 99.0, 69, 157, 92.0, 146.0, 157.0, 157.0, 0.2248414276247278, 1.268465749402395, 0.30344809861071664], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL-00", 20, 0, 0.0, 202.29999999999998, 86, 1131, 109.0, 675.700000000001, 1110.3999999999996, 1131.0, 0.22882771561291504, 8.879587995698039, 1.0692779484451156], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser", 20, 1, 5.0, 1980.7499999999998, 1093, 10562, 1308.0, 3169.2000000000025, 10198.149999999994, 10562.0, 0.23226375872440744, 4.696128235724489, 0.19588181839296706], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-0", 20, 0, 0.0, 107.55000000000001, 26, 887, 36.5, 442.50000000000074, 866.4499999999997, 887.0, 0.2289875316289028, 0.8367884212454633, 0.15519272163130718], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases-0", 20, 0, 0.0, 138.75, 71, 431, 106.5, 265.0000000000001, 422.9499999999999, 431.0, 0.23435943706863216, 1.3076524215188836, 0.31966947629454295], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser-0", 20, 1, 5.0, 1980.4999999999998, 1093, 10557, 1308.0, 3169.2000000000025, 10193.399999999994, 10557.0, 0.23225836420434093, 4.696019164218276, 0.1958772688738953], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T03_ClickStartNow-0", 20, 0, 0.0, 36.15, 28, 49, 33.5, 45.800000000000004, 48.849999999999994, 49.0, 0.23277196494454208, 1.3132066811373238, 0.31756097170656766], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases", 20, 0, 0.0, 138.75, 71, 431, 106.5, 265.0000000000001, 422.9499999999999, 431.0, 0.23435119870638138, 1.3076064540320125, 0.31965823905579904], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM-0", 20, 0, 0.0, 110.70000000000002, 67, 546, 83.0, 146.40000000000003, 526.0999999999997, 546.0, 0.23558790962847787, 1.3269765089405612, 0.3237033094211605], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T07_ClickBackLinkInBrowser", 20, 0, 0.0, 1585.2499999999998, 1232, 2056, 1659.5, 1959.4000000000003, 2051.7, 2056.0, 0.2311711128577373, 4.760612379502057, 0.19496032525775578], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL", 20, 0, 0.0, 202.29999999999998, 86, 1131, 109.0, 675.700000000001, 1110.3999999999996, 1131.0, 0.2286472087891987, 8.87258348481211, 1.0684344668518708], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink", 19, 0, 0.0, 99.0, 69, 157, 92.0, 146.0, 157.0, 157.0, 0.22481216352126843, 1.2683006529905934, 0.30340860350233684], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue-0", 20, 0, 0.0, 1645.6, 1117, 3014, 1594.5, 2895.8000000000025, 3013.75, 3014.0, 0.22987448852926304, 1.608661221754172, 0.3570687123580525], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T06_SelectLinkUnderGases-0-0", 20, 0, 0.0, 138.75, 71, 431, 106.5, 265.0000000000001, 422.9499999999999, 431.0, 0.23435943706863216, 1.3076524215188836, 0.31966947629454295], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T02_EnterPassword-01-1", 20, 0, 0.0, 36.949999999999996, 27, 52, 36.0, 46.900000000000006, 51.75, 52.0, 0.2326690631580172, 1.2676374056236113, 0.34059660710338646], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T02_EnterPassword-02-0", 20, 0, 0.0, 35.35000000000001, 25, 58, 33.5, 48.7, 57.55, 58.0, 0.232750293847246, 1.2680799700915872, 0.31548574986325917], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T02_EnterPassword-01-0", 20, 0, 0.0, 33.900000000000006, 22, 49, 32.5, 48.7, 49.0, 49.0, 0.23262846907204504, 0.17992358154790983, 0.28942252890408726], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T04_EnterPostcode&Continue", 20, 0, 0.0, 1645.6, 1117, 3014, 1594.5, 2895.8000000000025, 3013.75, 3014.0, 0.22989827001551813, 1.6088276445485372, 0.35710565262371396], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T02_EnterPassword", 20, 0, 0.0, 106.75, 78, 143, 109.5, 136.8, 142.75, 143.0, 0.23242300987797793, 2.7123583672283558, 0.9444454532248693], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser-0-0", 20, 0, 0.0, 1980.4999999999998, 1093, 10557, 1308.0, 3169.2000000000025, 10193.399999999994, 10557.0, 0.23225836420434093, 4.696019164218276, 0.1958772688738953], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T08_SelectLinkUnderPM-0-0", 20, 0, 0.0, 110.70000000000002, 67, 546, 83.0, 146.40000000000003, 526.0999999999997, 546.0, 0.23558790962847787, 1.3269765089405612, 0.3237033094211605], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-2", 20, 0, 0.0, 53.85, 23, 128, 52.0, 119.00000000000009, 127.75, 128.0, 0.23148416069630437, 0.3415747722774569, 0.23238839569902428], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-1", 20, 0, 0.0, 63.55000000000002, 25, 154, 52.5, 142.40000000000003, 153.5, 154.0, 0.23141184365815842, 0.4447446370305232, 0.22757004547242726], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-4", 20, 0, 0.0, 70.54999999999998, 40, 157, 60.0, 123.90000000000005, 155.45, 157.0, 0.2314038112207708, 3.2342298302653045, 0.23208175207395665], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T01_LaunchURL-00-3", 20, 0, 0.0, 80.95, 38, 169, 70.0, 158.40000000000003, 168.54999999999998, 169.0, 0.23139845657229466, 4.1134239306498825, 0.2325283318485266], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T03_ClickStartNow", 20, 0, 0.0, 36.15, 28, 49, 33.5, 45.800000000000004, 48.849999999999994, 49.0, 0.23276383781015783, 1.3131608310832827, 0.31754988419999064], "isController": true}, {"data": ["AQIE_ESW_PostcodeSearch_T03_ClickStartNow-0-0", 20, 0, 0.0, 36.15, 28, 49, 33.5, 45.800000000000004, 48.849999999999994, 49.0, 0.23277196494454208, 1.3132066811373238, 0.31756097170656766], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T02_EnterPassword-02", 20, 0, 0.0, 35.35000000000001, 25, 58, 33.5, 48.7, 57.55, 58.0, 0.232750293847246, 1.2680799700915872, 0.31548574986325917], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T02_EnterPassword-01", 20, 0, 0.0, 71.4, 52, 102, 71.5, 90.60000000000001, 101.44999999999999, 102.0, 0.232533804601844, 1.4467508487483869, 0.629703359532142], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T10_ClickChangeLocationLink-0", 19, 0, 0.0, 99.0, 69, 157, 92.0, 146.0, 157.0, 157.0, 0.2248414276247278, 1.268465749402395, 0.30344809861071664], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /The air pollution forecast for today/", 1, 100.0, 0.20080321285140562], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 498, 1, "Test failed: text expected to contain /The air pollution forecast for today/", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["AQIE_ESW_PostcodeSearch_T09_ClickBackLinkInBrowser-0", 20, 1, "Test failed: text expected to contain /The air pollution forecast for today/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
