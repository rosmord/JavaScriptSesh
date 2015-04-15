echo "var signsSizes= {"
sed 's/\(.*\);\([^ ]*\) \([^ ]*\) \([^ ]*\) \([^ ]*\)/"\1":[\2,\3,\4,\5],/' < sizes.csv
echo "}"
