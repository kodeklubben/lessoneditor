import './itemlist.scss';
import React from 'react';
import {Button, Card, Image} from 'semantic-ui-react';

function ItemList({items, removeLesson, navigateToHome}) {
  return (
      <Card.Group>
        {items.length > 0 &&
        items.map((listitem, index) =>
            (
                <Card key={'listitem' + index}>
                  <Image className={'itemListImage'} src={`${listitem.thumb}?${performance.now()}`} wrapped ui={false}/>
                  <Card.Header>
                    {listitem.lessonTitle
                        ? listitem.lessonTitle
                        : listitem.lesson}
                  </Card.Header>
                  <Card.Meta>
                    {listitem.courseTitle
                        ? listitem.courseTitle
                        : listitem.course}
                  </Card.Meta>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button onClick={() => navigateToHome(listitem.lessonId)}>
                        Åpne
                      </Button>
                      <Button onClick={async () => {await removeLesson(listitem.lessonId);}}>
                        Fjerne
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
            ),
        )}
      </Card.Group>
  );
}

export default ItemList;
