# Contentful Setup for Partner Page

This document explains how to set up Contentful content types for the Partner page.

## Content Types to Create

### 1. Partner Content Type

**Content Type ID:** `partner`

**Fields:**

- `name` (Short text, Required) - Partner organization name
- `description` (Rich text, Optional) - Partner description/description
- `logo` (Media, Image, Optional) - Partner logo image
- `websiteUrl` (Short text, URL, Optional) - Partner website URL
- `order` (Number, Integer, Optional) - Order for sorting partners (lower numbers appear first)

**Example Entry:**

- Name: "The Glebe Centre"
- Description: "We are proud to partner with The Glebe Centre, a cornerstone of care for older residents in Ottawa for over 130 years..."
- Logo: [Upload logo image]
- Website URL: "https://glebecentre.ca/"
- Order: 1

### 2. Sponsor Content Type

**Content Type ID:** `sponsor`

**Fields:**

- `name` (Short text, Required) - Sponsor organization name
- `logo` (Media, Image, Required) - Sponsor logo image (will be displayed in white/inverted)
- `websiteUrl` (Short text, URL, Optional) - Sponsor website URL
- `order` (Number, Integer, Optional) - Order for sorting sponsors (lower numbers appear first)

**Example Entries:**

- Name: "uOttawa", Logo: [Upload uOttawa logo], Order: 1
- Name: "SPCO", Logo: [Upload SPCO logo], Order: 2
- Name: "Bridgehead", Logo: [Upload Bridgehead logo], Order: 3
- Name: "The Merry Dairy", Logo: [Upload Merry Dairy logo], Order: 4

## How It Works

1. **Partners Section:**
   - Partners are displayed in an infinite scroll format
   - They alternate between left and right positions as you scroll
   - Partners loop infinitely (when you reach the end, it starts over)
   - Each partner card shows: name, logo, description, and website link

2. **Sponsors Section:**
   - Sponsors are displayed in a 2x2 grid
   - Each sponsor shows their logo (inverted to white)
   - Logos are clickable if a website URL is provided
   - If no sponsors are in Contentful, it falls back to hardcoded sponsors

## Notes

- Make sure the Content Type IDs match exactly: `partner` and `sponsor`
- The `order` field is used for sorting - set lower numbers for items you want to appear first
- Logo images should be high quality and work well when inverted to white
- Rich text descriptions support formatting (bold, italic, links, etc.)
