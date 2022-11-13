import React, { useState,useEffect } from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  NavItem,
} from "reactstrap";
import {apiGet } from "../api/api";


export function TagsPopup(props) {
  const { tagIds, onChange, onClose } = props;
  const [errmsg, setErrmsg] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      const params = {};
      let data = await apiGet("tag/List", params);
      if (data.errText) {
        setLoading(false);
        return setErrmsg(data.errText);
      }
      const newTags = data.result || [];
      setTags(newTags);
      setLoading(false);
      setLoaded(true);
    }
    fetchTags();
  }, []);

  function handleChange(tagId) {
    const ix = tagIds.findIndex((x) => x === tagId);

    if (ix >= 0) {
      tagIds.splice(ix, 1);
    } else {
      tagIds.push(tagId);
    }
    onChange(tagIds);
  }

  return (
    <Modal isOpen={true}>
      <ModalHeader>Set tags for post</ModalHeader>
      <ModalBody>
        {loading && <h3>Loading...</h3>}
        {!loading && !loaded && <h3>Could not load active tags</h3>}
        {loaded && tags.length === 0 && <h3>There are no tags available</h3>}
        {loaded && tags.length > 0 && (
          <Form>
            {tags.map((tag) => (
              <FormGroup check inline key={`tag-${tag.id}`}>
                <Input
                  type="checkbox"
                  checked={tagIds.includes(tag.id)}
                  onChange={() => handleChange(tag.id)}
                />
                <Label check>{tag.name}</Label>
              </FormGroup>
            ))}{" "}
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
}
