# React-portfolio-component
Flex / Grid layouts with carousel, part of a data-driven site

![cropped 0](https://user-images.githubusercontent.com/35608297/223524327-f26da03d-a209-4335-aa00-6ceb39170c9c.png)


## Reason for this repo

This is one of the pages of a recently built site - offered here as a demonstration of my coding skills as of 3/7/23. This portfolio page is the second most complicated page of the site. It is one of the three generic pages available for admin setup.

## History

The site is a re-creation of a Flash site. After that was rendered useless by the inexorable march of tech advancement, it lay dormant for some time.

For this new site the functionality previously done using Flash has been rebuilt, and improved, using JavaScript and CSS. The react-player package is used for playing videos. Icons come from the react-icons package.

## Portfolio

All art elements were harvested from the old site. When first visited, the page will start to "carousel" though the available images. After a few seconds, a cycle indicator/control becomes visible in the upper right.

Two page arrangements are available...

1. "Grid" has smaller thumbnails arrange using a flex grid (shown above)
2. "Column" that has bigger thumbnails arranged in a flex column.

![cropped 1](https://user-images.githubusercontent.com/35608297/223524380-e2f59140-cabf-4b53-948b-b67870d088a8.png)


## Improvements

- The original Flash site had fixed pages. This site has scrolling pages with a fixed bottom footer.
- All pages have been made responsive to user screen sizes.
- A "retreating" menu box was added to make better use of screen real estate.

![cropped 2](https://user-images.githubusercontent.com/35608297/223524417-2b9df110-4257-4baf-a440-ed247eadf1a3.png)


## Services

Since site traffic is expected to be slight, all services are hosted on the same virtual machine:

- a web server hosting React Components,
- a FusionAuth server providing authentication for admin and VIP users, and
- an Express server providing image files and data from a PostgreSQL database.

## Data Schema

Pages, types and images are not hard coded for display. Instead they are presented based upon data sourced from the API. As of 12/20/22 the staged site is operating based upon this schema.

![cropped 3](https://user-images.githubusercontent.com/35608297/223524515-a5b0f824-d1e7-47da-92b8-1a4e73bb04a2.png)


## Admin / VIP access

The plan is to allow admin users to upload files, create pages and place images as they wish.

They also will be able to register users as VIP viewers - who will have exclusive access to pages specifically created for them. This way the artist may post examples of work in progress for clients to view. As of 3/7/23 the interface to allow an admin to manage this data is under development.

Each of the three page types available (Single, Multiple Type and Multiple Type/Image) is built so that an admin user may see a preview of the page they're editing. If the page component receives data as props (instead of from state) it knows it is being used for previewing.

## Home Page

(Not included here but visible at https://www.staging.leonj.d3.tools)

The original art elements for the eyes were also harvested from the old site and reused. The eyes track the user's mouse and randomly blink (timed in a multiple-factor pattern). The mouse and hat animation elements were added as a new feature.

![cropped 4](https://user-images.githubusercontent.com/35608297/223524577-5a53cea8-e5dd-48ed-b0b7-50bf8b883fdf.png)

