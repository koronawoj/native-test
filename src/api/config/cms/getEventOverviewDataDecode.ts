import { buildModelValidator, buildApiItemDefault, buildArrayDecoderModel, buildApiItemSimple } from 'src/api/utils/modelUtils';
import { decodeStringOrNull, decodeString, decodeNumberOrNull, buildOptionalDecoderModel } from 'src/api/utils/commonModelValidators';

const decodeBannerModel = buildModelValidator('BannerModel', {
    url: buildApiItemDefault(decodeString, null),
});

const modelConfig = buildModelValidator('GetF1OverviewFromCMSType - decode error', {
    event_id: buildApiItemDefault(decodeNumberOrNull, null),
    name: buildApiItemDefault(decodeString, ''),
    stream_url: buildApiItemDefault(decodeStringOrNull, null),
    description1: buildApiItemDefault(decodeString, ''),
    description2: buildApiItemDefault(decodeString, ''),
    homepage_widget_banner_title: buildApiItemDefault(decodeStringOrNull, null),
    homepage_widget_banner_subtitle: buildApiItemDefault(decodeStringOrNull, null),
    promo_banner_bg_color: buildApiItemDefault(decodeString, null),
    promo_banner_mobile: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    promo_banner_tablet: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    promo_banner_desktop: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    promo_banner_event_page_desktop: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    promo_banner_event_page_mobile: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    promo_banner_event_page_tablet: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    bg_header_img_mobile: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    bg_header_img_tablet: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    bg_header_img_desktop: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    header_img_mobile: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    header_img_tablet: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    header_img_desktop: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    widget_img_homepage_mobile: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    widget_img_homepage_tablet: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
    widget_img_homepage_desktop: buildApiItemSimple(
        buildOptionalDecoderModel(decodeBannerModel)
    ),
});

export const decodeEventOverviewData = buildArrayDecoderModel(modelConfig);

export type EventOverviewDataType = ReturnType<typeof decodeEventOverviewData>;

export type EventOverviewItemType = ReturnType<typeof modelConfig>;
