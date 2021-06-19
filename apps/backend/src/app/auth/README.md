## Authentication

Litt om auth.

### Passport

Passport tar seg av kommunikasjon med github og sørger for at vi alltid

### Whitelist (whitelist.js)

Her legger vi paths som ikke skal trigge auth. På denne måten er aller routes by default sikret, unntatt disse på
whitelista.

### Sessioner

På Google App Engine bruker vi `@google-cloud/connect-datastore`
som igjen lagrer dette i en "tabell" i datastore som er bundlet med App Engine. Dette er zero config og mer en godt nok
for dette usecaset. Hvis man skal flytte til annen hosting bør det ikke være en stor sak å endre på dette.

Lokalt lagres dette i minnet, dvs at hver gang feks nodemon restarter så vil sessionen bli slettet.

Sessionstiden er satt til 1 dag i første omgang. Dette bør funke fint for de aller fleste. Vi kan utvide dette hvis vi
ser at dette er nyttig.
