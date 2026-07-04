
#!/bin/bash
# sh scripts/resume.sh

curl -X POST http://localhost:3000/parse-resume \
  -F "resume=@test-files/test1.pdf"