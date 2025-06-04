#!/bin/sh

cd $(dirname $0)/../

PBJS='node_modules/.bin/pbjs'
PBTS='node_modules/.bin/pbts'
SRC_DIR=./proto
OUT_DIR=./codegen

[[ -d "$OUT_DIR" ]] || mkdir $OUT_DIR

${PBJS} \
--target static-module \
--wrap commonjs \
--keep-case \
--path ${SRC_DIR} \
--out ${OUT_DIR}/tenant_pb.js \
${SRC_DIR}/*.proto

${PBTS} \
--out ${OUT_DIR}/tenant_pb.d.ts \
${OUT_DIR}/tenant_pb.js