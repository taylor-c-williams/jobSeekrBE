# Seekr Back End Concepts/Planning

### Metrics

    ○ Funnel: saved, applied, interviewed, offers etc
    ○ Stats: # jobs saved, applied etc

### Routes & Utils

    - Log in / Sign up ✓
    - Post new job ✓
    - Edit job ✓
    - Delete Job ✓
    - Get all jobs
    - Get job by id ✓
    - Get all jobs WHERE
        ○ Fav = true ✓
        ○ Applied = true ✓
        ○ Phone Screen = true ✓
    	○ Interviewed = true ✓
    	○ Take Home = true ✓
    	○ Tech interview = true ✓
    	○ Offer = true ✓
    	○ Rejected = true
    	○ Starred = true
    - CRUD: Journal
    - CRUD: Profile

- CRUD: Contacts/Rolodex

### Jobs Table Columns

    - Starred / Fav: bool
    - Wishlist: bool
    - Applied: boolean
    - Phone screen: boolean
    - Take Home: bool
    - Interviewed: boolean
    - Offer: boolean
    - Rejected: boolean
    - Accepted: boolean
    - Remote: varchar (yes/no/hybrid)
    - Date created
    - Date last updated
    - URL: varchar
    - Description: varchar
    - Notes: Varchar
    - Contact ?: varchar

- Zip code: int
