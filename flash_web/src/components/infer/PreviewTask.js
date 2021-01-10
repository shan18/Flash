import _ from 'lodash';
import React from 'react';

const PreviewTask = () => {
  const classList = [
    'birdhouse',
    'hourglass',
    'lemon',
    'pizza',
    'seashore',
    'stopwatch',
  ];

  return (
    <>
      <div className="row mt-5 mb-4">
        <div className="col">
          <h4 className="text-center">Preview Model</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-11 mx-auto">
          Want to test out the platform without training a model? No worries. We
          have prepared a <b>preview</b>{' '}
          <mark>
            <b>image classification model</b>
          </mark>{' '}
          just for these cases. Please use the token given to below to test it
          out.
        </div>
      </div>
      <div className="row my-4">
        <div className="col-11 mx-auto">
          <h5>
            <b>Token:</b>&nbsp;&nbsp;&nbsp; classification-tinyimgnet-demo-dbasb
          </h5>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-11 mx-auto mb-2">
          <h5>About the Model</h5>
        </div>
        <div className="col-11 mx-auto">
          <p>
            The model can classify images belonging to the following{' '}
            <mark>
              <b>six classes</b>
            </mark>
            :
          </p>
          {_.map(classList, item => {
            return (
              <button className="btn btn-sm btn-success mr-2 my-1" key={item}>
                {item}
              </button>
            );
          })}
        </div>
        <div className="col-11 mx-auto mt-3">
          The model was trained by fine-tuning a{' '}
          <mark>
            <b>ResNet34</b>
          </mark>{' '}
          model pre-trained on the ImageNet dataset.
        </div>
      </div>
    </>
  );
};

export default PreviewTask;

// classification-tinyimgnet-demo-dbasb
