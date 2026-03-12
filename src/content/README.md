# Content (JSON) files

Each page has its own JSON file so you can edit copy in one place without touching source code.

| File             | Page                | Wired?                           |
| ---------------- | ------------------- | -------------------------------- |
| `join-us.json`   | Join Us             | Yes                              |
| `home.json`      | Home                | Yes                              |
| `contact.json`   | Contact             | No (use same pattern as join-us) |
| `club-info.json` | Club Info           | No                               |
| `events.json`    | Events              | No                               |
| `partner.json`   | Partners & Sponsors | No                               |
| `team.json`      | Team                | No                               |
| `workshops.json` | Workshops           | Yes                              |
| `blog.json`      | Blog                | No                               |

To wire a page: in the page component, add  
`import pageContent from '@/content/<page>.json'`  
and replace hardcoded strings with `pageContent.section.key`.
