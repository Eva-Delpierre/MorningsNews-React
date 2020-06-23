import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav';
import {connect} from 'react-redux';

const { Meta } = Card;

function ScreenMyArticles(props) {

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [langFiltre, setLangFiltre] = useState('');

  useEffect( () => {
    const findArticlesWishList = async () => {
      const dataWishList = await fetch(`/wishlist-article?token=${props.token}&lang=${langFiltre}`);
      const body = await dataWishList.json();

      props.saveArticles(body.articles)
    }
    findArticlesWishList();

  }, [langFiltre])

  var deleteArticle = async (title) => {
    props.deleteToWishList(title);

    const deleteReq = await fetch('/whislist-article',  {
      method: "DELETE",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: `title=${title}&token=${props.token}`
    }) 
  }

  var filtreLang = (lang) => {
    setLangFiltre(lang);
  }

  var showModal = (title, content) => {
    setTitle(title);
    setContent(content);
    setVisible(true);
  }

  var handleOk = (e) => {
    setVisible(false);
  }

  var handleCancel = (e) => {
    setVisible(false);
  }

  var noArticles;
  if(props.myArticles.length === 0){
    noArticles = <div style={{marginTop:"30px"}}> No articles </div>;
  }

  return (
    <div>
         
      <Nav/>

      <div style={{display:"flex", justifyContent:"center", alignItems:"center" }} className="Banner">
        <img style={{width: "40px", margin:"10px", cursor: 'pointer'}} src="/images/drapeau-fr.png" alt="fr" onClick={() => filtreLang('fr') } />
        <img style={{width: "40px", margin:"10px", cursor: 'pointer'}} src="/images/drapeau-en.png" alt="en" onClick={() => filtreLang('en')} />
      </div>


      <div className="Banner"/>

      <div className="Card">
        {noArticles}
        {props.myArticles.map((article,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'center'}}>
            <Card
              style={{ 
              width: 300, 
              margin:'15px', 
              display:'flex',
              flexDirection: 'column',
              justifyContent:'space-between' }}
              cover={ <img alt="example" src={article.urlToImage} /> }
              actions={[
                  <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)} />,
                  <Icon type="delete" key="ellipsis" onClick={() => deleteArticle(article.title)} />
              ]}
              >
  
              <Meta
                title={article.title}
                description={article.description}
              />
            </Card>  
          </div>
        ))}
      </div>
            
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p> {content} </p>

      </Modal>



    </div>
  );
}

function mapStateToProps(state){
  return {myArticles : state.wishList, token: state.token}
};

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList : function(articleTitle) {
      dispatch({type: 'deleteArticle',
      title: articleTitle})
    },
    saveArticles : function(articles) {
      dispatch({type: 'saveArticles ',
      articles: articles})
    }
  } 
}

export default connect(mapStateToProps, mapDispatchToProps) (ScreenMyArticles);
