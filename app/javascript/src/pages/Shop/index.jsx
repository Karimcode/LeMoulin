import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Col, Row, Container,
} from 'react-bootstrap';

import Image from 'react-bootstrap/Image';
import ShopImage from './Page-Grise.jpg';
import { find } from '../../api/api-manager';

const Shop = () => {
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
    <Container style={{ marginTop: 20 }}>
      <Card>
        <Card.Header as="h4" style={{ backgroundColor: '#45B5AA' }} className="text-white text-center">
          { shop && shop.name}
        </Card.Header>
        <Card.Body className="text-primary">
          <Row className="mb-5">
            <Col xs={6} md={4}>
              <Image src={ShopImage} className="Page-Grise.jpg/171x180" thumbnail />
            </Col>
            <Col xs={6} md={4}>
              <Image src={ShopImage} className="Page-Grise.jpg/171x180" thumbnail />
            </Col>
            <Col xs={6} md={4}>
              <Image src={ShopImage} className="Page-Grise.jpg/171x180" thumbnail />
            </Col>
          </Row>
          <Card.Title as="h5" className="text-center">Description</Card.Title>
          <Card.Text className="text-center">
            {
              shop && shop.description
                ? shop.description
                : 'Shop description'
            }
          </Card.Text>
          <Row>
            <Col className="text-center mt-4">
              <p className="m-0">Shop address :</p>
              <p className="m-0">
                {shop?.address}
                {' '}
                {shop?.zip_code}
              </p>
            </Col>
            <Col className="text-center mt-4">
              <p className="m-0">Shop city :</p>
              <p className="m-0">{shop?.city}</p>
            </Col>
            <Col className="text-center mt-4">
              <p className="m-0">References :</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Shop;
