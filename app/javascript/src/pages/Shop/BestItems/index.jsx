/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Row, Col, Container, Card, Button,
} from 'react-bootstrap';

import ShopItem from '../ShopItem';

const BestItems = ({ bestItems }) => {
  const [showLength, setShowLength] = useState(8);

  const showMore = () => {
    setShowLength(showLength + 8);
  };

  const handleOnClick = () => { showMore(); };

  return (
    <Container className="px-5" fluid>
      <Card className="p-3">
        {
            bestItems?.length === 0
              ? (
                <Row>
                  <Col as="h4" xs={12} className="mb-3">Aucun produit n&apos;est disponible pour l&apos;instant</Col>
                </Row>
              )
              : (
                <Row>
                  <Col as="h4" xs={12} className="mb-3">Nos produits</Col>
                  {
                    bestItems?.slice(0, showLength).map((item) => (
                      <ShopItem key={item.id} item={item} />
                    ))
                  }
                </Row>
              )
          }
        <Row className="d-flex flex-column">
          {
            showLength < bestItems?.length && (
              <Button
                variant="primary"
                className="align-self-end"
                onClick={handleOnClick}
              >
                Afficher plus
              </Button>
            )
          }
        </Row>
      </Card>
    </Container>
  );
};

export default BestItems;
