import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Col, Row, Container, Button
} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { find } from '../../../api/api-manager';

import ItemInformations from './Informations';
import CommentsOnItem from './Comments';
import Carousel from './Carousel';

const Item = () => {
  const { item_id } = useParams();
  const [item, setItem] = useState({});
  const [alert, setAlert] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    find(`items/${item_id}`, {
      authRequired: false,
      onError: (error) => console.log(error),
      onErrors: (errors) => console.log(errors),
      onSuccess: (result) => setItem(result),
    });
  }, []);

  const showAlert = () => {
    setAlert(true)
    window.setTimeout(()=>{
      setAlert(false)
    }, 2000)
  }

  return (
    <Container fluid>
      <Alert variant='success' show={alert} >
        Le produit { item.name } a été ajouté à votre panier
      </Alert>

      <Row className="m-5 p-2">
        <Col sm={5}>
          <Carousel item={item} />
        </Col>
        <Col sm={6} className="p-5" style={{ backgroundColor: 'white' }}>
          <Row className="justify-content-center">
            <h2>{ item?.name }</h2>
          </Row>
          { !showComments && (
            <ItemInformations item={item} alert={showAlert} />
          )}
          { showComments && (
            <CommentsOnItem item={item} />
          )}
          <Row className="justify-content-end">

          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Item;
