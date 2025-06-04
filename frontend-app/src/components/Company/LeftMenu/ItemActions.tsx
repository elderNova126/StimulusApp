import { Box, Center, Flex, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { GrDrag } from 'react-icons/gr';
import { SwitchButton } from '../../GenericComponents';
import { Section } from '../company.types';

const ItemActions = (props: {
  item: any;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  index: number;
}) => {
  const { item, sections, setSections, index } = props;
  const [hover, setHover] = useState(false);

  return (
    <Draggable draggableId={item.name} index={index}>
      {(provided: any, snapshot: any) => (
        <Box
          bg={snapshot.isDragging ? 'menu.company_category' : 'transparent'}
          ref={provided.innerRef}
          {...provided.draggableProps}
          _hover={{ bg: 'menu.company_category' }}
          p="8px 16px"
          borderRadius="28px 0px 0px 28px"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <a href={item.href}>
              <Text textStyle="body">{item.name}</Text>
            </a>
            <Stack direction="row" spacing={2} visibility={hover ? 'visible' : 'hidden'}>
              {/* extra sanity check, without this we got updates one frame later because of change detection trigger */}
              {hover && (
                <SwitchButton
                  onChange={(e: any) => {
                    setSections(
                      sections.map((section: Section) => {
                        if (section.name === item.name) {
                          section.show = e.target.checked;
                        }
                        return section;
                      })
                    );
                  }}
                  small
                  isChecked={!!sections.find((s: Section) => s.name === item.name)?.show}
                />
              )}
              <Center {...provided.dragHandleProps}>
                <GrDrag />
              </Center>
            </Stack>
          </Flex>
        </Box>
      )}
    </Draggable>
  );
};

export default ItemActions;
