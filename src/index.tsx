import React, { useMemo, useRef } from "react";
import { useShallowMemo } from "./useShallowMemo";

export function withDataItem<
  TLowerProps,
  TLowerEventHandlers extends PickPropertiesOfType<TLowerProps, LowerHandler>,
  TPickedLowerHandlerKeys extends KeyList<TLowerEventHandlers>,
  TPickedLowerHandlers extends Pick<
    TLowerEventHandlers,
    TPickedLowerHandlerKeys[number]
  >,
  TPickedLowerHandlerKey extends keyof TPickedLowerHandlers,
>(
  Target: React.ComponentType<TLowerProps>,
  lowerHandlerKeys: TPickedLowerHandlerKeys,
) {
  return function DataComponent<
    TDataItem,
    THigherEventHandlers extends DataItemHandlerMap<
      {
        [key in TPickedLowerHandlerKey]: TPickedLowerHandlers[TPickedLowerHandlerKey];
      },
      TDataItem
    >,
  >(
    higherProps: { dataItem: TDataItem } & TLowerProps &
      TLowerEventHandlers &
      THigherEventHandlers,
  ) {
    const itemRef = useRef(higherProps.dataItem);
    itemRef.current = higherProps.dataItem;

    higherProps = useShallowMemo(higherProps);

    const lowerProps = useMemo(() => {
      const lowerProps = {} as TLowerProps & TLowerEventHandlers;

      const bannedKeys = new Set<keyof typeof higherProps>(["dataItem"]);

      lowerHandlerKeys.forEach((key) => {
        const dataItemHandlerKey =
          `${key}DataItem` as keyof THigherEventHandlers;

        bannedKeys.add(dataItemHandlerKey);

        const dataItemHandler = higherProps[dataItemHandlerKey];

        if (typeof dataItemHandler === "function") {
          const lowerHandler = (...args: any[]) =>
            dataItemHandler(itemRef.current, ...args);
          // TODO: shouldn't need an any cast here
          lowerProps[key] = lowerHandler as any;
        }
      });

      entries(higherProps)
        .filter(([key]) => !bannedKeys.has(key))
        .forEach(([key, value]) => {
          // TODO: shouldn't need an any cast here
          (lowerProps as any)[key] = value;
        });

      return lowerProps;
    }, [higherProps]);

    return <Target {...lowerProps} />;
  };
}

function entries<T, K extends keyof T>(value: T): [key: K, value: T[K]][] {
  return Object.entries(value) as [key: K, value: T[K]][];
}

type DataItemHandlerMap<
  TProps extends Record<string | symbol, LowerHandler>,
  TItem,
> = {
  [TKey in keyof TProps as `${string & TKey}DataItem`]: DataItemHandler<
    TItem,
    TProps[TKey]
  >;
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

type LowerHandler = (...args: any[]) => any;

type DataItemHandler<TItem, TLowerHandler extends LowerHandler> = (
  dataItem: TItem,
  ...lowerArgs: Parameters<TLowerHandler>
) => void;
