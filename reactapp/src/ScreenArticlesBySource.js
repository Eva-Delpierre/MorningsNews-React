import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

const { Meta } = Card;

function ScreenArticlesBySource(props) {
 
  const [articleList, setArticleList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect( () => {
    async function findArticles() {
      var dataAPI = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=c9be14724c014ce89429d617fa23059c`);
      var articleAPI = await dataAPI.json();
      setArticleList(articleAPI.articles)
    }
    findArticles();
  }, []);

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

  var saveArticle = async (article) => {
    props.addToWishList(article);

    const saveReq = await fetch('/wishlist-article', {
      method: "POST",
      headers: {"Content-Type" : "application/x-www-form-urlencoded"},
      body: `name=${article.title}&content=${article.content}&desc=${article.description}&img=${article.urlToImage}&lang=${props.selectedLang}&token=${props.token}`
    })
  }


  return (
    <div>
      <Nav/>
      <div className="Banner"/>

      <div className="Card">

          {articleList.map((article,i)=>(
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
                  <Icon type="like" key="ellipsis" onClick={() => {saveArticle(article)}  }/>
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

function mapDispatchToProps(dispatch){
  return {
    addToWishList: function(article){
    dispatch({type:'addArticle',
    articleLiked : article})
  }
  }
}

function mapStateToProps(state){
  return {token: state.token, selectedLang: state.selectedLang}
}

export default connect(mapStateToProps, mapDispatchToProps) (ScreenArticlesBySource);

