# Managing Translation Files

Keep the list of used translation keys updated in `allowed-keys.json`.

Translation files can be pruned of keys no longer required by running:

```
jq --slurpfile allowed allowed-keys.json '. as $input | $allowed[0] | map(select($input[.] != null)) | map({(.): $input[.]}) | add' en/messages.json > tmp.json && mv tmp.json en/messages.json
```

Or for all locales:
```
for F in `find . -name "*messages.json"`; do jq --slurpfile allowed allowed-keys.json '. as $input | $allowed[0] | map(select($input[.] != null)) | map({(.): $input[.]}) | add' $F > tmp.json && mv tmp.json $F; done
```

Translation files can be sorted by translation key by running:

```
jq -S '.' en/messages.json > tmp.json && mv tmp.json en/messages.json
```