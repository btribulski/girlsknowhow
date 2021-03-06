{* Relationship tab within View Contact - browse, and view relationships for a contact *}
{if $cdType }
  {include file="CRM/Custom/Form/CustomData.tpl"}
{else}
 <div class="view-content">
   {if $action eq 1 or $action eq 2 or $action eq 4 or $action eq 8} {* add, update or view *}
    {include file="CRM/Contact/Form/Relationship.tpl"}
    <div class="spacer"></div>
  {/if}

  {* start of code to show current relationships *}
  {if $currentRelationships}
    {* show browse table for any action *}
      <div id="current-relationships">
        <p></p>
        {if $relationshipTabContext} {*to show the title and links only when viewed from relationship tab, not from dashboard*}
         <div><label>{ts}Current Relationships{/ts}</label></div>
        {/if}
        {strip}
        <table class="selector">
        <tr class="columnheader">
            <th>{ts}Relationship{/ts}</th>
            <th></th>
            <th>{ts}Start{/ts}</th>
            <th>{ts}End{/ts}</th>
            <th>{ts}City{/ts}</th>
            <th>{ts}State/Prov{/ts}</th>
            <th>{ts}Email{/ts}</th>
            <th>{ts}Phone{/ts}</th>
            <th>&nbsp;</th>
        </tr>

        {foreach from=$currentRelationships item=rel}
            {*assign var = "rtype" value = "" }
            {if $rel.contact_a eq $contactId }
                {assign var = "rtype" value = "a_b" }
            {else}
                {assign var = "rtype" value = "b_a" }
            {/if*}
            <tr class="{cycle values="odd-row,even-row"}">
            {if $relationshipTabContext}
                <td class="bold"><a href="{crmURL p='civicrm/contact/view/rel' q="action=view&reset=1&selectedChild=rel&cid=`$contactId`&id=`$rel.id`&rtype=`$rel.rtype`"}">{$rel.relation}</a></td>
                <td><a href="{crmURL p='civicrm/contact/view' q="action=view&reset=1&cid=`$rel.cid`"}">{$rel.name}</a></td>
            {else}
                <td class="bold">{$rel.relation}</strong></td>
                <td>{$rel.name}</td>
            {/if}
                <td>{$rel.start_date|crmDate}</td>
                <td>{$rel.end_date|crmDate}</td>
                <td>{$rel.city}</td>
                <td>{$rel.state}</td>
                <td>{$rel.email}</td>
                <td>{$rel.phone}</td> 
                <td class="nowrap">{$rel.action}</td>
            </tr>
        {/foreach}
        </table>
        {/strip}
        </div>
{/if}
{* end of code to show current relationships *}

{if NOT ($currentRelationships or $inactiveRelationships) }

  {if $action NEQ 1} {* show 'no relationships' message - unless already in 'add' mode. *}
       <div class="messages status">
           <dl>
           <dt><img src="{$config->resourceBase}i/Inform.gif" alt="{ts}status{/ts}" /></dt>
           {capture assign=crmURL}{crmURL p='civicrm/contact/view/rel' q="cid=`$contactId`&action=add&reset=1"}{/capture}
           <dd>
                {if $permission EQ 'edit'}
                    {ts 1=$crmURL}There are no Relationships entered for this contact. You can <a accesskey="N" href='%1'>add one</a>.{/ts}
                {elseif ! $relationshipTabContext}
                    {ts}There are no related contacts / organizations on record for you.{/ts}
                {else}
                    {ts}There are no Relationships entered for this contact.{/ts}
                {/if}
           </dd>
           </dl>
      </div>
  {/if}
{else}

  <div>
    {if $action NEQ 1 AND $action NEQ 2 AND $permission EQ 'edit'}
            <div class="action-link">
                <a accesskey="N" href="{crmURL p='civicrm/contact/view/rel' q="cid=`$contactId`&action=add&reset=1"}" class="button"><span>&raquo; {ts}New Relationship{/ts}</span></a>
            </div>
        {/if}
  </div>

{/if}
<div class="spacer"></div>

{* start of code to show inactive relationships *}

{if $inactiveRelationships}
    {* show browse table for any action *}
      <div id="inactive-relationships">
        <p></p>
        <div class="label font-red">{ts}Inactive Relationships{/ts}</div>
        <div class="description">{ts}These relationships are Disabled OR have a past End Date.{/ts}</div>
        {strip}
        <table class="selector">
        <tr class="columnheader">
            <th>{ts}Relationship{/ts}</th>
            <th></th>
            <th>{ts}City{/ts}</th>
            <th>{ts}State/Prov{/ts}</th>
            <th>{ts}Phone{/ts}</th>
            <th>{ts}End Date{/ts}</th>
            <th>&nbsp;</th>
        </tr>

        {foreach from=$inactiveRelationships item=rel}
          {assign var = "rtype" value = "" }
          {if $rel.contact_a > 0 }
            {assign var = "rtype" value = "b_a" }
          {else}
            {assign var = "rtype" value = "a_b" }
          {/if}
          <tr class="{cycle values="odd-row,even-row"}">
            <td class="bold">{$rel.relation}</td>
            <td><a href="{crmURL p='civicrm/contact/view' q="reset=1&cid=`$rel.cid`"}">{$rel.name}</a></td>
            <td>{$rel.city}</td>
            <td>{$rel.state}</td>
    	    <td>{$rel.phone}</td>
            <td>{$rel.end_date|crmDate}</td>
            <td class="nowrap">{$rel.action}</td>
          </tr>
        {/foreach}
        </table>
        {/strip}
        </div>    
{/if}
</div>
{* end of code to show inactive relationships *}


{/if} {* close of custom data else*}

{if $searchRows }
 {*include custom data js file*}
 {include file="CRM/common/customData.tpl"}
{/if}
