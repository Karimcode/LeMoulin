import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, Col, Row, Container, Button,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Image from 'react-bootstrap/Image';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ShopImage from './Boutique.jpg';
import { find } from '../../api/api-manager';

const Shop = () => {
  const { currentUserId } = useSelector((state) => state);
  const { id } = useParams();
  const [shop, setShop] = useState(null);

  useEffect(
    () => find(`shops/${id}`, {
      authRequired: true,
      onSuccess: (result) => setShop(result),
    }),
    [],
  );

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header style={{ backgroundColor: '#45B5AA' }} className="text-center p-2">
          <h4 className="text-white">{ shop && shop.name}</h4>
          <p className="text-white m-0">
            {
              shop && shop.shop_categories
                && shop.shop_categories.map(({ title }) => title).join(' - ')
            }
          </p>
        </Card.Header>
        <Jumbotron fluid style={{ backgroundImage: `url(${ShopImage})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
          <div className="display-4 text-center" />
          <div className="my-4 text-center" />
        </Jumbotron>
        <Card.Body className="text-primary">
          <Card.Title as="h6" className="text-center">Description</Card.Title>
          <Card.Text className="text-center">
            {
              shop && shop.description
                ? shop.description
                : 'Shop description'
            }
          </Card.Text>
          <Row>
            <Col className="text-center mt-4">
              <h6 className="m-0">Shop address :</h6>
              <p className="m-0">
                {shop?.address}
                {' '}
                {shop?.zip_code}
              </p>
            </Col>
            <Col className="text-center mt-4">
              <h6 className="m-0">Shop city :</h6>
              <p className="m-0">{shop?.city}</p>
            </Col>
            <Col className="text-center mt-4">
              <h6 className="m-0">References :</h6>
            </Col>
          </Row>

          { currentUserId === shop?.shopkeeper_id && (
            <Col className="text-center mt-4">
              <Button as={Link} to={`/shop/${id}/list_items`} className="btn btn_success_sass" variant="outline-success">
                Voir tous mes produits
              </Button>
            </Col>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Shop;
