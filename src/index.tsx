import React, { useMemo, useRef } from 'react';
import { useShallowMemo } from './useShallowMemo';

export function withDataItem<
  TProps,
  TNativeEventHandlers extends PickPropertiesOfType<TProps, NativeHandler>,
  TPickedNativeHandlerKeys extends KeyList<TNativeEventHandlers>,
  TPickedNativeHandlers extends Pick<
    TNativeEventHandlers,
    TPickedNativeHandlerKeys[number]
  >,
  TPickedNativeHandlerKey extends keyof TPickedNativeHandlers
>(
  Target: React.ComponentType<TProps>,
  nativeHandlerKeys: TPickedNativeHandlerKeys
) {
  return function DataComponent<
    TItem,
    TDataItemEventHandlers extends DataItemHandlerMap<
      Record<
        TPickedNativeHandlerKey,
        TPickedNativeHandlers[TPickedNativeHandlerKey]
      >,
      TItem
    >
  >(
    props: { dataItem: TItem } & TProps &
      TNativeEventHandlers &
      TDataItemEventHandlers
  ) {
    const itemRef = useRef(props.dataItem);
    itemRef.current = props.dataItem;

    props = useShallowMemo(props);

    const handledProps = useMemo(() => {
      const newProps = {} as TNativeEventHandlers;

      nativeHandlerKeys.forEach((key) => {
        const dataItemHandlerKey =
          `${key}DataItem` as keyof TDataItemEventHandlers;
        const dataItemHandler = props[dataItemHandlerKey];
        if (typeof dataItemHandler === 'function') {
          const nativeHandler = () => dataItemHandler(itemRef.current);
          // TODO: shouldn't need an any cast here
          newProps[key] = nativeHandler as any;
        }
      });

      return newProps;
    }, [props]);

    const combinedProps = {
      ...props,
      ...handledProps,
    };

    return <Target {...combinedProps} />;
  };
}

type DataItemHandlerMap<TProps, TItem> = {
  [TKey in keyof TProps as `${string & TKey}DataItem`]: DataItemHandler<TItem>;
};

type KeyList<T> = (keyof T)[];

type PickPropertiesOfType<TProps, TPropertyType> = {
  [TKey in keyof TProps as Exclude<
    TProps[TKey],
    undefined
  > extends TPropertyType
    ? TKey
    : never]: TPropertyType;
};

type NativeHandler = (...args: any[]) => any;

type DataItemHandler<TItem> = (dataItem: TItem) => void;
