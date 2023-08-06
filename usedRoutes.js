app.post("/book", async (req, res) => {
    const { books } = req.body;
  
    if(books){
      for (let bookdata of books) {
          if (
            bookdata.volumeInfo.title ||
            bookdata.volumeInfo?.authors[0] ||
            bookdata.volumeInfo.imageLinks?.thumbnail ||
            bookdata.saleInfo.saleInfo
          ) {
            let title =
              bookdata.volumeInfo.title.length > 25
                ? bookdata.volumeInfo.title.slice(0, 25)
                : bookdata.volumeInfo.title;
            let author =
              bookdata.volumeInfo.authors[0].length > 20
                ? bookdata.volumeInfo.authors[0].slice(0, 20)
                : bookdata.volumeInfo.authors[0];
            let image = bookdata.volumeInfo.imageLinks?.thumbnail
              ? bookdata.volumeInfo.imageLinks.thumbnail
              : books[6].volumeInfo.imageLinks.thumbnail;
            let description =  ( bookdata.volumeInfo.description.length > 300)
            ?  bookdata.volumeInfo.description.slice(0, 300) : bookdata.volumeInfo.description;
            let bookType = "mostpopular";
            let country = bookdata.saleInfo.country;
      
            const newBooks = new book({
              title,
              author,
              image,
              description,
              bookType,
              country
            });
            // await newBooks.save();  
            // console.log("ho gya"); 
            
          }  
        }
        res.status(200).send("books available");
    } else {
      res.status(350).send("please solve this error");
    } 
   
  });