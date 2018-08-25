
  $(document).ready(() => {
    $('.instrument-delete').on('click', (e) => {
      $target = $(e.target);
      const id = $target.attr('data-cat-id');
      const title = $target.attr('data-cat-title');
      $.ajax({
        type:'DELETE',
        url: '/instruments/delete/'+id,
        success: (response) =>{
         if (response =='ok'){
          alert('Deleting Instrument: '+title);
          window.location.href='/manage/instruments';
         }
        },
        error: (error) => {
          console.log(error);
        }
      });
    });

    $('.article-delete').on('click', (e) => {
      $target = $(e.target);
      const id = $target.attr('data-article-id');
      const title = $target.attr('data-article-title');
      $.ajax({
        type:'DELETE',
        url: '/articles/delete/'+id,
        success: (response) =>{
         if (response =='ok'){
          alert('Deleting Article: '+title);
          window.location.href='/manage/articles';
         }
        },
        error: (error) => {
          console.log(error);
        }
      });
    });
  });

