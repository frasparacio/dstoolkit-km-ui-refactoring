import {
    Button,
    Dialog,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Divider,
    Tab,
    TabList,
    TabListProps,
    Text,
    makeStyles,
    shorthands,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import { KMBrandRamp } from "../../styles";
import { useEffect, useState } from "react";
import { set } from "date-fns";

const useStyles = makeStyles({
    dialog: {
        maxHeight: "fit-content",
        height: "50vw",
        maxWidth: "fit-content",
        width: "70vw",
        "@media (max-width: 780px)": {
            // adjust width to your needs
            width: "90vw",
            backgroundColor: "red", // red color only to show when it changes
        },
        ...shorthands.borderRadius("1rem"),
    },
    tabList: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        ...shorthands.padding("10px", "0px"),
        rowGap: "20px",
    },
});

interface DocDialogProps {
    title: string;
    lastModified: string;
    summary: string;
    filePath: string;
    tokens: any;
}

export function DocDialog({ title, lastModified, summary, filePath, tokens }: DocDialogProps, props: Partial<TabListProps>) {
    const styles = useStyles();

    const [urlWithSasToken, setUrlWithSasToken] = useState<string>("");

    useEffect(() => {
        const [[firstKey, firstValue]] = Object.entries(tokens || {});
      
        if (filePath.startsWith(firstKey)) {
          setUrlWithSasToken(filePath + firstValue);
        }
      }, [filePath]);

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button>See More</Button>
            </DialogTrigger>
            <DialogSurface className={styles.dialog}>
                <DialogBody className="">
                    <DialogTitle
                        action={
                            <DialogTrigger action="close">
                                <Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />} />
                            </DialogTrigger>
                        }
                    >
                        {title}
                        <div>
                        <Text weight="semibold" size={200} style={{ color: KMBrandRamp[40]}}>
                            {lastModified}
                        </Text>
                        </div>
                        <div className="flex justify-between -ml-3 mt-5">
                            <div className={styles.tabList}>
                                <TabList {...props}>
                                    <Tab value="tab1">Document</Tab>
                                    <Tab value="tab2">Tab2</Tab>
                                    <Tab value="tab3">Tab3</Tab>
                                </TabList>
                            </div>
                            <div className="mt-4">
                            <Button className="h-8" appearance="primary">
                                Download
                            </Button>
                            </div>
                        </div>
                        <div className="pb-4 ">
                            <Divider />
                        </div>
                    </DialogTitle>

                    <div className="flex w-full justify-between" style={{ width: "200%" }}>
                        <div className="mr-5 w-full flex-grow-0" style={{ width: "450%", height: "300%" }}>
                            <iframe
                                src={urlWithSasToken}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <DialogContent className="">
                            <div className="flex justify-between mb-4 ">
                                <Text size={400} weight="semibold">
                                    Extractive Summary
                                </Text>
                            </div>
                            <div className="flex mb-4">
                                <Text size={200} weight="regular">
                                    {summary}
                                </Text>
                            </div>
                        </DialogContent>
                    </div>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
