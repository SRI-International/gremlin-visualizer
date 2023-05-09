import artifact from '../assets/icons/stix2_artifact_icon_tiny_round_v1.png';
import attack_goal from '../assets/icons/stix2_attack_goal_icon_tiny_round_v1.png';
import attack_pattern from '../assets/icons/stix2_attack_pattern_icon_tiny_round_v1.png';
import attack_plan from '../assets/icons/stix2_attack_plan_icon_tiny_round_v1.png';
import attack_step from '../assets/icons/stix2_attack_step_icon_tiny_round_v1.png';
import autonomous_system from '../assets/icons/stix2_autonomous_system_icon_tiny_round_v1.png';
import bundle from '../assets/icons/stix2_bundle_icon_tiny_round_v1.png';
import campaign from '../assets/icons/stix2_campaign_icon_tiny_round_v1.png';
import coa from '../assets/icons/stix2_coa_icon_tiny_round_v1.png';
import course_of_action from '../assets/icons/stix2_course_of_action_icon_tiny_round_v1.png';
import custom_object from '../assets/icons/stix2_custom_object_icon_tiny_round_v1.svg';
import directory from '../assets/icons/stix2_directory_icon_tiny_round_v1.png';
import domain_name from '../assets/icons/stix2_domain_name_icon_tiny_round_v1.png';
import email_addr from '../assets/icons/stix2_email_addr_icon_tiny_round_v1.png';
import email_message from '../assets/icons/stix2_email_message_icon_tiny_round_v1.png';
import file from '../assets/icons/stix2_file_icon_tiny_round_v1.png';
import firmware_product from '../assets/icons/stix2_firmware_product_icon_tiny_round_v1.png';
import grouping from '../assets/icons/stix2_grouping_icon_tiny_round_v1.png';
import hardware_product from '../assets/icons/stix2_hardware_product_icon_tiny_round_v1.png';
import http from '../assets/icons/stix2_http_icon_tiny_round_v1.png';
import identity from '../assets/icons/stix2_identity_icon_tiny_round_v1.png';
import incident from '../assets/icons/stix2_incident_icon_tiny_round_v1.png';
import indicator from '../assets/icons/stix2_indicator_icon_tiny_round_v1.png';
import infrastructure from '../assets/icons/stix2_infrastructure_icon_tiny_round_v1.png';
import intrusion_set from '../assets/icons/stix2_intrusion_set_icon_tiny_round_v1.png';
import ipv4_addr from '../assets/icons/stix2_ipv4_addr_icon_tiny_round_v1.png';
import ipv6_addr from '../assets/icons/stix2_ipv6_addr_icon_tiny_round_v1.png';
import language from '../assets/icons/stix2_language_icon_tiny_round_v1.png';
import location from '../assets/icons/stix2_location_icon_tiny_round_v1.png';
import logical_and from '../assets/icons/stix2_logical_and_icon_tiny_round_v1.png';
import logical_nand from '../assets/icons/stix2_logical_nand_icon_tiny_round_v1.png';
import logical_nor from '../assets/icons/stix2_logical_nor_icon_tiny_round_v1.png';
import logical_not from '../assets/icons/stix2_logical_not_icon_tiny_round_v1.png';
import logical_nxor from '../assets/icons/stix2_logical_nxor_icon_tiny_round_v1.png';
import logical_or from '../assets/icons/stix2_logical_or_icon_tiny_round_v1.png';
import logical_xor from '../assets/icons/stix2_logical_xor_icon_tiny_round_v1.png';
import mac_addr from '../assets/icons/stix2_mac_addr_icon_tiny_round_v1.png';
import malware_analysis from '../assets/icons/stix2_malware_analysis_icon_tiny_round_v1.png';
import malware from '../assets/icons/stix2_malware_icon_tiny_round_v1.png';
import marking_definition from '../assets/icons/stix2_marking_definition_icon_tiny_round_v1.png';
import mutex from '../assets/icons/stix2_mutex_icon_tiny_round_v1.png';
import network_traffic from '../assets/icons/stix2_network_traffic_icon_tiny_round_v1.png';
import note from '../assets/icons/stix2_note_icon_tiny_round_v1.png';
import observed_data from '../assets/icons/stix2_observed_data_icon_tiny_round_v1.png';
import opinion from '../assets/icons/stix2_opinion_icon_tiny_round_v1.png';
import os_product from '../assets/icons/stix2_os_product_icon_tiny_round_v1.png';
import process from '../assets/icons/stix2_process_icon_tiny_round_v1.png';
import relationship from '../assets/icons/stix2_relationship_icon_tiny_round_v1.png';
import report from '../assets/icons/stix2_report_icon_tiny_round_v1.png';
import sighting from '../assets/icons/stix2_sighting_icon_tiny_round_v1.png';
import software from '../assets/icons/stix2_software_icon_tiny_round_v1.png';
import software_product from '../assets/icons/stix2_software_product_icon_tiny_round_v1.png';
import source from '../assets/icons/stix2_source_icon_tiny_round_v1.png';
import threat_actor from '../assets/icons/stix2_threat_actor_icon_tiny_round_v1.png';
import tlp from '../assets/icons/stix2_tlp_icon_tiny_round_v1.png';
import tool from '../assets/icons/stix2_tool_icon_tiny_round_v1.png';
import url from '../assets/icons/stix2_url_icon_tiny_round_v1.png';
import user_account from '../assets/icons/stix2_user_account_icon_tiny_round_v1.png';
import victim from '../assets/icons/stix2_victim_icon_tiny_round_v1.png';
import victim_target from '../assets/icons/stix2_victim_target_icon_tiny_round_v1.png';
import vulnerability from '../assets/icons/stix2_vulnerability_icon_tiny_round_v1.png';
import windows_registry_key from '../assets/icons/stix2_windows_registry_key_icon_tiny_round_v1.png';
import x509_certificate from '../assets/icons/stix2_x509_certificate_icon_tiny_round_v1.png';
import { NodeData } from './utils';

const assignIcon = (node: NodeData) => {
  const { label } = node;

  switch (label) {
    case 'artifact':
      return artifact;
    case 'attack-goal':
      return attack_goal;
    case 'attack_pattern':
      return attack_pattern;
    case 'attack_plan':
      return attack_plan;
    case 'attack_step':
      return attack_step;
    case 'autonomous_system':
      return autonomous_system;
    case 'bundle':
      return bundle;
    case 'campaign':
      return campaign;
    case 'coa':
      return coa;
    case 'course_of_action':
      return course_of_action;
    case 'custom_object':
      return custom_object;
    case 'directory':
      return directory;
    case 'domain_name':
      return domain_name;
    case 'email_addr':
      return email_addr;
    case 'email_message':
      return email_message;
    case 'file':
      return file;
    case 'firmware_product':
      return firmware_product;
    case 'grouping':
      return grouping;
    case 'hardware_product':
      return hardware_product;
    case 'http':
      return http;
    case 'identity':
      return identity;
    case 'incident':
      return incident;
    case 'indicator':
      return indicator;
    case 'infrastructure':
      return infrastructure;
    case 'intrusion_set':
      return intrusion_set;
    case 'ipv4_addr':
      return ipv4_addr;
    case 'ipv6_addr':
      return ipv6_addr;
    case 'language':
      return language;
    case 'location':
      return location;
    case 'logical_and':
      return logical_and;
    case 'logical_nand':
      return logical_nand;
    case 'logical_nor':
      return logical_nor;
    case 'logical_not':
      return logical_not;
    case 'logical_nxor':
      return logical_nxor;
    case 'logical_or':
      return logical_or;
    case 'logical_xor':
      return logical_xor;
    case 'mac_addr':
      return mac_addr;
    case 'malware_analysis':
      return malware_analysis;
    case 'malware':
      return malware;
    case 'marking_definition':
      return marking_definition;
    case 'mutex':
      return mutex;
    case 'note':
      return note;
    case 'observed_data':
      return observed_data;
    case 'opinion':
      return opinion;
    case 'os_product':
      return os_product;
    case 'process':
      return process;
    case 'relationship':
      return relationship;
    case 'report':
      return report;
    case 'sighting':
      return sighting;
    case 'software':
      return software;
    case 'software_product':
      return software_product;
    case 'source':
      return source;
    case 'threat_actor':
      return threat_actor;
    case 'tlp':
      return tlp;
    case 'tool':
      return tool;
    case 'url':
      return url;
    case 'user_account':
      return user_account;
    case 'victim':
      return victim;
    case 'victim_target':
      return victim_target;
    case 'vulnerability':
      return vulnerability;
    case 'windows_registry_key':
      return windows_registry_key;
    case 'x509_certificate':
      return x509_certificate;
    default:
      break;
  }
};

export default assignIcon;