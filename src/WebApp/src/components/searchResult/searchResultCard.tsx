import { Button, makeStyles, Text } from "@fluentui/react-components";
import { Tag, TagGroup } from "@fluentui/react-tags-preview";
import { Sparkle24Regular } from "@fluentui/react-icons";
import { Icon } from '@fluentui/react';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { KMBrandRamp } from "../../styles";
import { DocDialog } from "../documentViewer/documentViewer";

interface SearchResultCardProps {
    key: any;
    content_group: any;
    title: any;
    translated_title: any;
    authors: any;
    summary: any;
    key_phrases: any;
    source_last_modified: any;
    source_processing_date: any;
    document_url: any;
    metadata_storage_path: any;
    tokens: any;
}

const useStyles = makeStyles({
    wrapper: {
        columnGap: "6px",
        display: "flex",
        marginTop: "10px",
    },
});

export function SearchResultCard({
    content_group,
    title,
    translated_title,
    authors,
    summary,
    key_phrases,
    source_last_modified,
    source_processing_date,
    document_url,
    metadata_storage_path,
    tokens
}: SearchResultCardProps) {
    const styles = useStyles();

    let fileType = '';
    switch(content_group.toLowerCase()) {
        case 'pdf':
            fileType = 'pdf';
            break;
        case 'doc':
            fileType = 'docx';
            break;
        case 'ppt':
            fileType = 'pptx';
            break;
        // Add more cases as needed
        default:
            fileType = 'default'; // Default file type
    }

    // const [urlImageWithSasToken, setUrlImageWithSasToken] = useState<string>("");

    // useEffect(() => {
    //     const imageUrl = Object.keys(tokens).find(url => url.endsWith('/images'));
    
    //     if (imageUrl) {
    //         const imageToken = tokens[imageUrl];
    //         if (imageToken) {
    //             const imageUrlWithToken = imageUrl + imageToken;
    //             setUrlImageWithSasToken(imageUrlWithToken);
    //         }
    //     }
    // }, [tokens]);

    // console.log("tokens", tokens)
    // console.log("urlImageWithSasToken", urlImageWithSasToken)

    return (
        <div className="min-h-80 flex min-w-[278px] flex-grow flex-col overflow-hidden bg-white py-5 pl-5 pr-4 ">
            <div className="-ml-5 -mr-4 -mt-5 h-1" />
            <div className="flex flex-row ">
                <div className="flex items-center">
                    <img className="w-20 h-20" src="" alt="image" />
                </div>
                <div className="ml-5 flex-col">
                    <div className="flex-1 flex-row items center">
                            <Icon className="" {...getFileTypeIconProps({ extension: fileType, size: 24, imageFileType: 'png' }) } />
                            <Text className="ml-2 pb-2" weight="semibold">{content_group}</Text>
                    </div>
                    <div className="mt-2 flex-1 flex-row">
                        <Text as="h1" size={500} weight="bold">
                            {translated_title}
                        </Text>
                    </div>
                    <div className="mt-2 flex-1 flex-row">
                        <Text weight="semibold" size={200} style={{ color: KMBrandRamp[40]}}>
                            {source_last_modified} | {authors}
                        </Text>
                    </div>
                    <div className={styles.wrapper}>
                        <DocDialog title={title} lastModified={source_last_modified} summary={summary} filePath={metadata_storage_path} tokens={tokens}/>
                        <Button appearance="outline">Download</Button>
                        <Button appearance="outline">
                            <Sparkle24Regular />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex min-h-[80px] flex-1 text-ellipsis pt-2 ">{summary}</div>

            <div className="flex flex-wrap items-center">
                <TagGroup role="list" className="flex flex-wrap">
                    {key_phrases.map((key_phrase: string, index: number) => (
                        <Tag key={index} role="listitem" size="extra-small" className="mb-2">
                            {key_phrase}
                        </Tag>
                    ))}
                </TagGroup>
            </div>
            <h6 className="border-b border-b-neutral-300 pb-5"></h6>
        </div>
    );
}
