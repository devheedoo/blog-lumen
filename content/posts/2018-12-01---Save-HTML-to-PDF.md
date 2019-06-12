---
title: Save HTML to PDF
date: "2019-06-11T05:00:00"
template: "post"
draft: false
slug: "/posts/save-html-to-pdf/"
category: "JavaScript"
tags:
  - "HTML"
  - "JavaScript"
  - "Web Development"
description: "A프로젝트에서 HTML 화면을 PDF로 출력해야하는 경우가 생겼다. iText 라이브러리의 경우 html을 pdf로 변환해주지만 CSS 적용에 한계가 있었다. 그래서 두 가지 라이브러리를 이용해 현재 화면을 이미지로 추출한 후 PDF로 저장하는 방법을 골랐다"
---

- [HTML2CANVAS](#html2canvas)
- [jsPDF](#jspdf)
- [HTML2CANVAS + jsPDF](#html2canvas-+-jspdf)

프로젝트에서 HTML 화면을 PDF로 출력해야하는 경우가 생겼다.

iText 라이브러리의 경우 html을 pdf로 변환해주지만 CSS 적용에 한계가 있었다.

그래서 두 가지 라이브러리를 이용해 현재 화면을 이미지로 추출한 후 PDF로 저장하는 방법을 골랐다:

1. html2canvas.js를 이용해 현재 화면을 canvas 이미지로 추출
2. jsPDF.js를 이용해 추출한 canvas 이미지를 PDF로 저장

## HTML2CANVAS

HTML 요소를 canvas 객체로 변환해준다.

[About - html2canvas | HTML2CANVAS](http://html2canvas.hertzen.com/documentation/)

```html
<div id="capture" style="padding: 10px; background: #f5da55">
    <h4 style="color: #000; ">Hello world!</h4>
</div>
```

```javascript
html2canvas(document.querySelector("#capture")).then(canvas => {
  document.body.appendChild(canvas)
});
```

## jsPDF

PDF 파일을 생성해준다.

[Home - Documentation | jsPDF](http://raw.githack.com/MrRio/jsPDF/master/docs/)

```javascript
// Default export is a4 paper, portrait, using milimeters for units
var doc = new jsPDF()

doc.text('Hello world!', 10, 10)
doc.save('a4.pdf')
```

## HTML2CANVAS + jsPDF

버튼을 눌러 현재 화면을 A4 크기로 변환해 PDF로 저장한다.

[JSFiddle에서 보기](https://jsfiddle.net/devheedoo/87wo3tqe/3/)

```html
<html>

  <head>
    <title>HTML2PDF</title>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js"></script>
  </head>

  <body>
    <h1>HTML2PDF</h1>
    <p>Save this HTML to PDF</p>
    <button onclick="fnSaveAsPdf();">Save PDF</button>

    <script>
      function fnSaveAsPdf() {
        html2canvas(document.body).then(function(canvas) {
          var imgData = canvas.toDataURL('image/png');
          var imgWidth = 210;
          var pageHeight = imgWidth * 1.414;
          var imgHeight = canvas.height * imgWidth / canvas.width;

          var doc = new jsPDF({
            'orientation': 'p',
            'unit': 'mm',
            'format': 'a4'
          });

          doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          doc.save('sample_A4.pdf');
          console.log('Reached here?');
        });
      }

    </script>
  </body>

</html>
```

### Tip

현재 화면을 A4 크기로 변환하기 때문에 **사용자의 브라우저 창 크기에 따라 결과물이 달라질 수 있다.** 통일된 결과물을 얻기 위해선 새 창에서 화면을 띄운 후 PDF로 저장하는 것이 좋다.

```javascript
var newWindow = window.open('[URL]', '[TITLE]', 'width=780,height=500');
```