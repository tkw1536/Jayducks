#/usr/bin/env bash

cmd="$1"

if [ -z "$cmd" ] ; then
    echo "Usage: $0 <command>"
    exit
fi


script=""
case "$cmd" in 
    "clear")
script=$(cat <<EOF
db.Courses.drop();
db.DocumentGroups.drop()
db.Documents.drop()
EOF
)
    ;;
    "show")
script=$(cat <<EOF
db.Courses.find()
db.DocumentGroups.find()
db.Documents.find()
EOF
)
    ;;
    *)
echo "Unknown command, redirecting to mongo console"
    ;;
esac

mongo hackathon-w14 --eval "$script"
