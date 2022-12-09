import React, { FC, useCallback, useState } from 'react';
import s from './CreateChannelView.module.scss';
import { ModalCtaButton } from 'src/components/common';
import cn from 'classnames';
import { useNetworkClient } from 'src/contexts/network-client-context';
import { useUI } from 'src/contexts/ui-context';
import useInput from 'src/hooks/useInput';

const CreateChannelView: FC = ({}) => {
  const { createChannel } = useNetworkClient();
  const { closeModal } = useUI();
  const [channelName, onChannelNameChange, { set: setChannelName }] = useInput();
  const [channelDesc, onChannelDescChange, { set: setChannelDesc}] = useInput();
  const [error, setError] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<0 | 2>(2); //0 = public, 1 = private, and 2 = secret

  const handlePrivacyChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setPrivacyLevel(e.target.value === 'public' ? 0 : 2);
    },
    []
  );

  const onCreate = useCallback(async () => {
    if (channelName.includes(' ')) {
      setError('Name can’t contain spaces');
      return;
    }
    try {
      createChannel(channelName, channelDesc, privacyLevel);
      setChannelName('');
      setChannelDesc('');
      closeModal();
    } catch {
      setError('Something wrong happened, please check your details.');
    }
  }, [
    channelDesc,
    channelName,
    closeModal,
    createChannel,
    privacyLevel,
    setChannelDesc,
    setChannelName
  ])

  return (
    <div
      className={cn('w-full flex flex-col justify-center items-center', s.root)}
    >
      <h2 className='mt-9 mb-4'>Create a new Speakeasy</h2>
      <input
        type='text'
        placeholder='Name'
        value={channelName}
        onChange={onChannelNameChange}
      />
      <input
        type='text'
        placeholder='Description'
        className='mt-4'
        value={channelDesc}
        onChange={onChannelDescChange}
      />

      <div className={cn('mt-9 flex', s.radioButtonsContainer)}>
        <label className={cn('mr-9', s.container)}>
          <input
            type='radio'
            checked={privacyLevel === 0}
            name='radio'
            value='public'
            onChange={handlePrivacyChange}
          />
          <span className={s.checkmark}></span>
          <span className='headline--sm ml-2'>Public</span>
        </label>
        <label className={cn(s.container)}>
          <input
            type='radio'
            checked={privacyLevel === 2}
            name='radio'
            value='secret'
            onChange={handlePrivacyChange}
          />
          <span className={s.checkmark}></span>
          <span className='headline--sm ml-2'>Secret</span>
        </label>
      </div>

      <p className='mt-9 mb-6'>
        {privacyLevel === 0
          ? 'Public Speakeasies are accessible by anyone with just the link. No passphrase is needed to join. You can assume everyone knows when your codename is in a public speakeasy.'
          : 'Secret speakeasies hide everything: Speakeasy name, description, members, messages, and more. No one knows anything about the Speakeasy unless they are invited.'}
      </p>
      {error && (
        <div className={'text text--xs mt-2'} style={{ color: 'var(--red)' }}>
          {error}
        </div>
      )}
      <ModalCtaButton
        buttonCopy='Create'
        cssClass={cn('mt-5 mb-8', s.button)}
        onClick={onCreate}
      />
    </div>
  );
};

export default CreateChannelView;