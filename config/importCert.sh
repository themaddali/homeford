#!/bin/bash
REMHOST=/opt/hp/MGT_TOOLS/APPINSIGHT/GUI/jetty/etc
CACERTS=$JAVA_HOME/lib/security
ALIAS=app-insight
KEYSTORE_PASS=changeit
KEYTOOL=keytool

#if [[ "debug" != $1 ]]; then
#	echo() { :; }
#fi 

 
if [ -e "$CACERTS" ]
then

echo --- Adding certs to $CACERTS
 
set -e
 
echo "Removing AppInsight alias from cacerts in JVM if existing"
if $KEYTOOL -list -keystore cacerts -storepass ${KEYSTORE_PASS} -alias $ALIAS >/dev/null
	then
        $KEYTOOL -keystore cacerts -noprompt -storepass ${KEYSTORE_PASS} -delete -alias $ALIAS
	echo Deleted the Alias.
else
	echo "Key of $ALIAS already deleted, skipping it."
fi

if $KEYTOOL -list -keystore cacerts -storepass ${KEYSTORE_PASS} -alias $ALIAS >/dev/null
    then
    echo "Key of $ALIAS already found, skipping it."
else
	echo Importing certificate from Jetty to jvm.
    $KEYTOOL -keystore cacerts -importcert -trustcacerts -noprompt -storepass ${KEYSTORE_PASS} -alias $ALIAS -file $REMHOST/keystore.cert
    fi
 
if $KEYTOOL -list -keystore cacerts -storepass ${KEYSTORE_PASS} -alias $ALIAS >/dev/null
    then
		echo $ALIAS certificate found.
		exit 0
else
	echo $ALIAS certificate was not found.
	exit 1
fi		

else
   echo $CACERTS not found
fi
