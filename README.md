# გიორგი & ვიქტორია — ქორწილის მოწვევა

ინტერაქტიული საქორწილო მოწვევა, რომელიც განთავსებულია Vercel-ზე:

https://wedding-newest.vercel.app/

## მიმდინარე არქიტექტურა

- ყველა საიტზე გამოსაჩენი ფოტო ინახება `public/images`-ში და იტვირთება `/images/...` მისამართით, რათა Vercel-ზე სტაბილურად გამოჩნდეს.
- პროექტში არ არის და არ უნდა დაემატოს ადმინისტრატორის პანელი ან `/admin` მარშრუტი.
- RSVP მონაცემების საბოლოო დანიშნულება არის Google Sheets. Google Sheets ინტეგრაცია განხორციელდება ცალკე ეტაპზე; მანამდე ფორმის არსებული backend კოდი დროებით უცვლელია.

## Development

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

This project was built with [Lovable](https://lovable.dev).
