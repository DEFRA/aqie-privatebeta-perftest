FROM defradigital/cdp-perf-test-docker:latest

WORKDIR /opt/perftest

COPY scenarios/ ./scenarios/
COPY user.properties /opt/apache-jmeter-5.5/bin/user.properties
COPY jmeter.properties /opt/apache-jmeter-5.5/bin/jmeter.properties
COPY reportgenerator.properties /opt/apache-jmeter-5.5/bin/reportgenerator.properties
COPY saveservice.properties /opt/apache-jmeter-5.5/bin/saveservice.properties
COPY saveservice.properties /opt/apache-jmeter-5.5/bin/saveservice.properties
COPY system.properties /opt/apache-jmeter-5.5/bin/system.properties
COPY upgrade.properties /opt/apache-jmeter-5.5/bin/upgrade.properties
COPY log4j2.xml /opt/apache-jmeter-5.5/bin/log4j2.xml
COPY entrypoint.sh
ENV S3_ENDPOINT https://s3.eu-west-2.amazonaws.com
ENV TEST_SCENARIO test

ENTRYPOINT [ "./entrypoint.sh" ]

