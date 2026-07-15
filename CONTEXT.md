# Só Vale Reclamar

The ubiquitous language for a complaints-only social network: users file
complaints against entities and corroborate each other's complaints. Terms here
mirror the backend contract (`openapi.yaml`) — keep them in sync.

## Language

**Complaint**:
A public, attributed post describing a grievance, filed against exactly one
Entity. Has a title, content, an optional image, and a corroboration count.
_Avoid_: Post, review, report, ticket

**Entity**:
The thing a Complaint is filed against — always one of four kinds (see Entity
Type). Users create Entities and fuzzy-search them by name.
_Avoid_: Target, subject, business, company (a company is just one Entity Type)

**Entity Type**:
The fixed kind of an Entity: `PLACE`, `MOVIE`, `COMPANY`, or `PRODUCT`. The only
categorisation in the domain — there are no user tags or free categories.
_Avoid_: Category, tag, label

**Corroboration**:
A user's one-time endorsement of a Complaint, meaning "this happened to me too."
The sole engagement signal; it only ever adds. There is no opposing action.
_Avoid_: Upvote, like, vote, downvote, endorsement count

**Corroboration Count**:
The number of Corroborations on a Complaint; drives feed ranking.
_Avoid_: Score, votes, upvotes

**Author**:
The user who filed a Complaint, shown by `username`. Authorship is always
public — the domain has no anonymous complaints.
_Avoid_: Poster, owner, submitter

**Feed**:
The single global list of Complaints across all Entities, ranked by a time-decay
relevance score (Corroborations vs. age) and paged 10 at a time.
_Avoid_: Timeline, home, for-you, stream
