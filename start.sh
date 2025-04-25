#!/bin/bash
npx json-server --watch db.json --port ${PORT:-10000}